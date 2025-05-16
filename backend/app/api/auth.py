# Importaciones necesarias para la API, manejo de errores, base de datos y seguridad
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.usuario import Usuario, UserRole
from app.schemas.usuario import UsuarioCreate, UsuarioRead
from app.database import SessionLocal
from passlib.context import CryptContext

# Crear el enrutador de FastAPI
router = APIRouter()

# Contexto de encriptación para manejar contraseñas de forma segura
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Función para obtener una sesión de base de datos. Se asegura de cerrar la sesión al finalizar.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoint GET para listar todos los usuarios registrados en la base de datos
@router.get("/usuarios", response_model=list[UsuarioRead])
def listar_usuarios(db: Session = Depends(get_db)):
    return db.query(Usuario).all()

# Endpoint GET para obtener un usuario específico por ID
@router.get("/usuarios/{user_id}", response_model=UsuarioRead)
def obtener_usuario(user_id: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == user_id).first()
    if not usuario:
        # Si el usuario no existe, se lanza una excepción con código 404
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

# Endpoint POST para crear un nuevo usuario en la base de datos
@router.post("/usuarios", response_model=UsuarioRead)
def crear_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    # Verificar si el correo ya está registrado
    user_in_db = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if user_in_db:
        raise HTTPException(status_code=400, detail="Email ya registrado")

    # Encriptar la contraseña antes de guardarla
    hashed_password = pwd_context.hash(usuario.password)

    # Crear una nueva instancia del modelo Usuario
    new_user = Usuario(email=usuario.email, password=hashed_password, role=usuario.role)
    db.add(new_user)

    try:
        # Intentar guardar el nuevo usuario en la base de datos
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        # Si ocurre un error de integridad, hacer rollback y lanzar excepción
        db.rollback()
        raise HTTPException(status_code=500, detail="Error al crear usuario")
    
    return new_user

# Endpoint DELETE para eliminar un usuario existente por ID
@router.delete("/usuarios/{user_id}", status_code=204)
def eliminar_usuario(user_id: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == user_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Eliminar usuario y confirmar cambios
    db.delete(usuario)
    db.commit()
    return  # El código 204 indica "sin contenido"
