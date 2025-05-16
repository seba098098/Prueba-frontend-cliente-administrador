# backend/app/api/usuarios.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.usuario import Usuario, UserRole
from app.schemas.usuario import UsuarioCreate, UsuarioRead
from app.database import SessionLocal
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
import jwt
import os
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY", "tu_clave_secreta")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class UserLogin(BaseModel):
    email: EmailStr
    password: str

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expirado")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    email: str = payload.get("sub")
    if email is None:
        raise HTTPException(status_code=401, detail="Token inválido: no contiene email")
    user = db.query(Usuario).filter(Usuario.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    return user

def get_current_admin(current_user: Usuario = Depends(get_current_user)):
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="No tienes permisos suficientes")
    return current_user

@router.get("/usuarios", response_model=list[UsuarioRead])
def listar_usuarios(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return db.query(Usuario).all()

@router.get("/usuarios/{user_id}", response_model=UsuarioRead)
def obtener_usuario(user_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    usuario = db.query(Usuario).filter(Usuario.id == user_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

@router.post("/usuarios", response_model=UsuarioRead)
def crear_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    user_in_db = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if user_in_db:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    hashed_password = pwd_context.hash(usuario.password)
    new_user = Usuario(email=usuario.email, password=hashed_password, role=usuario.role)
    db.add(new_user)
    try:
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error al crear usuario")
    return new_user

@router.put("/usuarios/{user_id}", response_model=UsuarioRead)
def actualizar_usuario(
    user_id: int,
    usuario: UsuarioCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    db_user = db.query(Usuario).filter(Usuario.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    if usuario.email != db_user.email:
        if db.query(Usuario).filter(Usuario.email == usuario.email).first():
            raise HTTPException(status_code=400, detail="Email ya registrado por otro usuario")
    
    db_user.email = usuario.email
    if usuario.password:
        db_user.password = pwd_context.hash(usuario.password)
    db_user.role = usuario.role

    try:
        db.commit()
        db.refresh(db_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error al actualizar usuario")
    
    return db_user

@router.delete("/usuarios/{user_id}", status_code=204)
def eliminar_usuario(user_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    usuario = db.query(Usuario).filter(Usuario.id == user_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db.delete(usuario)
    db.commit()
    return

@router.post("/auth/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(Usuario).filter(Usuario.email == user.email).first()
    if not db_user or not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": db_user.email, "role": db_user.role.value})
    return {"access_token": access_token, "token_type": "bearer"}
