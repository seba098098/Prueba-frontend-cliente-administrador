from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

plain_password = "contraseña123"  # La que dices que usas
hashed_password = "$2b$12$n3sRMJKNx3W2uvp4BRTkMuTMYRud7IVz0eGQ/Z3WmfApXtlWDD6TK"  # Tu hash almacenado

is_valid = pwd_context.verify(plain_password, hashed_password)
print("¿Contraseña válida?", is_valid)
