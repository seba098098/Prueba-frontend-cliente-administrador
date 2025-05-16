
    
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.mime.text import MIMEText
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

router = APIRouter()

# Configuración SMTP
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USERNAME = "seba098098@gmail.com"
SMTP_PASSWORD = "fczoqvyotljejxxk"

@router.post("/enviar-pdf")
async def enviar_pdf_por_correo(
    file: UploadFile = File(...),  # Campo para el archivo PDF
    email_destino: str = Form(...),  # Correo del destinatario
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="El archivo debe ser un PDF")

    # Leemos el contenido del archivo PDF
    contenido = await file.read()

    try:
        # Crear el correo
        msg = MIMEMultipart()
        msg["From"] = SMTP_USERNAME
        msg["To"] = email_destino
        msg["Subject"] = "Inventario PDF"

        # Cuerpo del correo (mensaje simple)
        body = "Adjunto el inventario en PDF."
        msg.attach(MIMEText(body, "plain"))

        # Adjuntar el archivo PDF
        attachment = MIMEApplication(contenido, _subtype="pdf")
        attachment.add_header(
            "Content-Disposition", "attachment", filename=file.filename
        )
        msg.attach(attachment)

        # Establecer la conexión con el servidor SMTP
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()  # Usar TLS
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(SMTP_USERNAME, email_destino, msg.as_string())

        return {"message": "Correo enviado exitosamente con archivo PDF adjunto"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error enviando correo: {str(e)}")
