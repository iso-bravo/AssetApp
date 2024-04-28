from reportlab.pdfgen import canvas
import os, re
from reportlab.lib.pagesizes import letter, landscape
import logging
from .models import Asset, Areas, Estados, Usuario, Categorias
import qrcode
import pandas as pd
import PyPDF2
from PyPDF2 import PdfReader, PdfWriter
from dotenv import load_dotenv

load_dotenv()

ip = os.getenv('IP')
port = os.getenv('PORT')
direccion_qr_imgs = os.getenv('QR_IMGS')
direccion_labels_pdf = os.getenv('LABELS_PDF')
direccion_EtiquetasPDF = os.getenv('ETIQUETAS_PDF')

def generate_qr_list(id_list):
    logger = logging.getLogger(__name__)
    for i in id_list:
        # Crea un objeto QRCode
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        # Agrega la información que deseas codificar en el código QR
        data = "http://" + ip + ":" + port + f"/info/{i}/"
        # Agrega la información al objeto QRCode
        qr.add_data(data)
        # Compila el código QR
        qr.make(fit=True)
        # Crea una imagen del código QR
        img = qr.make_image(fill_color="black", back_color="white")
        # Guarda la imagen del código QR en un archivo
        url = direccion_qr_imgs + f"/qrcode{i}.png"
        logger.error(f'url: {url}')
        img.save(url)

def make_pdf():
    # Eliminar Etiquetas.pdf
    if os.path.exists(direccion_EtiquetasPDF):
        os.remove(direccion_EtiquetasPDF)
    
    # Eliminar PNGs
    l = os.listdir(direccion_qr_imgs)
    lista = [i for  i in l if ".png" in i]
    if len(lista) > 1:
        lista.pop(0)
        for archivo in lista:
            ruta_archivo = os.path.join(direccion_qr_imgs, archivo)  # Obtiene la ruta completa del archivo
            os.remove(ruta_archivo)
    
    assets = Asset.objects.all()

    df_asset = pd.DataFrame(list(assets.values()))
    
    _id = list(df_asset['id'])
    
    generate_qr_list(_id)
    
    l = os.listdir(direccion_qr_imgs)
    lista = [i for  i in l if ".png" in i]
    lista.pop(0)
    
    ordenado = sorted(lista, key=lambda x: [int(i) if i.isdigit() else i for i in re.split('(\d+)', x)])

    # crear documnento
    direccion_etiquetas_pdf = os.path.join(direccion_labels_pdf, "Etiquetas.pdf")
    c = canvas.Canvas(direccion_etiquetas_pdf)
    
    # Establecer el tamano de paginas
    c.setPageSize(landscape(letter))
    c.setPageSize((2*72, 1*72)) # Pulgadas, MEDIDA

    for qr,idde in zip(ordenado, _id):
        c.drawImage(direccion_qr_imgs + '/logo.png',80,25,width=45,height=35) 
        c.drawImage(direccion_qr_imgs + f'./{qr}',0.05,5, width=70,height=70)
        ATS = "Asset Tag System"
        serie = str(idde)
        c.drawString(80,10, serie)
        c.setFont('Times-Roman',7)
        c.drawString(10,5,ATS)

        # Agregar otra pagina
        c.showPage()
    c.save()
    
############################# Selected asset(s)
def asset_df():
    assets = Asset.objects.all()
    
    # Query para obtener las categoria
    categorias = Categorias.objects.all().values('id', 'categoria')
    categorias_dict = {categoria['id']: categoria['categoria'] for categoria in categorias}

    # Query para obtener los estados de activos
    estados = Estados.objects.all().values('id', 'estatus')
    estatus_dict = {estado['id']: estado['estatus'] for estado in estados}

    # Query para obtener los usuarios
    usuarios = Usuario.objects.all().values('id', 'nombre')
    usuarios_dict = {user['id']: user['nombre'] for user in usuarios}
    
    # Query para obtener las areas
    areas = Areas.objects.all().values('id', 'area')
    areas_dict = {area['id']: area['area'] for area in areas}

    # Transformar datos
    data = []
    for asset in assets:
        data.append({
            'id': asset.id,
            'numero_serie': asset.numero_serie,
            'modelo': asset.modelo,
            'descripcion': asset.descripcion,
            'marca': asset.marca,
            'id_categoria': categorias_dict.get(asset.id_categoria, ''),
            'imagen': asset.imagen,
            'fecha_registro': asset.fecha_registro,
            'id_estatus': estatus_dict.get(asset.id_estatus, ''),
            'tipo_compra': asset.tipo_compra,
            'noFactura_pedimento': asset.noFactura_pedimento,
            'factura_pedimentoPDF': asset.factura_pedimentoPDF,
            'id_usuario': usuarios_dict.get(asset.id_usuario, ''),
            'id_area': areas_dict.get(asset.id_area, ''),
        })

    # Crear DataFrame
    df = pd.DataFrame(data)
    return df

def get_page_pdf(id):
    
    if os.path.exists(direccion_labels_pdf + "/Etiqueta_asset.pdf"):
        os.remove(direccion_labels_pdf + "/Etiqueta_asset.pdf")
    
    df = asset_df()
    df = df.loc[df['id'].astype(str).str.match(str(id))]
    df = df[['id']]
    index = int(df.index[0])
    # Abrir doc
    file = direccion_labels_pdf + "/Etiquetas.pdf"
    with open(file, 'rb') as pdf_file:
        # Creando obj PDFREADER
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        
        # Seleccionar la hoja del pdf
        page = pdf_reader.pages[index] 
        
        # Crear un objeto PDFWriter
        pdf_writer = PyPDF2.PdfWriter()
        
        # Agregar la hoja seleccionada al objeto PDFWriter
        pdf_writer.add_page(page)
        
        # Crear un nuevo archivo PDF en modo escritura binaria
        url = direccion_labels_pdf + "/Etiqueta_asset.pdf"
        with open(url, 'wb') as new_pdf_file:
            # Escribir el contenido del objeto PDFWriter en el nuevo archivo PDF
            pdf_writer.write(new_pdf_file)

    
def get_pages_pdf(ids):
    
    if os.path.exists(direccion_labels_pdf + "/Etiquetas_seleccionadas.pdf"):
        os.remove(direccion_labels_pdf + "/Etiquetas_seleccionadas.pdf")
    
    df = asset_df()
    selected_assets = df[df['id'].astype(str).isin(ids)]
    
    file = direccion_labels_pdf + "/Etiquetas.pdf"
    pdf_file = open(file, 'rb')
    
    pdf_reader = PdfReader(pdf_file)
    
    pdf_writer = PdfWriter()

    for index, asset in selected_assets.iterrows():
        page_index = index
        page = pdf_reader.pages[page_index]
        pdf_writer.add_page(page)

    url = direccion_labels_pdf + "/Etiquetas_seleccionadas.pdf"
    new_pdf_file = open(url, 'wb')

    pdf_writer.write(new_pdf_file)

    pdf_file.close()
    new_pdf_file.close()
