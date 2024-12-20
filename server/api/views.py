import io
import logging
from datetime import datetime
import csv
from dotenv import load_dotenv
import os, re
import uuid

from django.contrib.auth import login
from django.http import HttpResponse
from rest_framework import status
from rest_framework import status as http_status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.exceptions import ObjectDoesNotExist

from .models import (Areas, Asset, Categorias, Departamento, EstadoPedimento, Estados, Permiso, UnidadMedida, Usuario)
from .serializers import (AreasSerializer, AssetSerializer, CategoriasSerializer, EstadoPedimentoSerializer, EstadosSerializer, UnidadMedidaSerializer, UsuarioSerializer, DepartamentoSerializer, 
PermisoSerializer)

from .labels_logic import generate_qr_list, make_pdf, asset_df, get_page_pdf, get_pages_pdf

from django.shortcuts import render
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.shortcuts import render, get_object_or_404

load_dotenv()
asset_info_html = os.getenv('ASSET_INFO_HTML')

#Login
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('nombre')
        password = request.data.get('contraseña')
        
        print(username)
        print(password)
        user = Usuario.objects.get(nombre=username)

        if user and user.contraseña == password:
            return Response({'mensaje': 'Inicio de sesión exitoso'}, status=200)
        else:
            return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

# Home
class AssetAndEmployeesView(APIView):
    def get(self, request):
        asset_count = Asset.objects.count()
        employee_count = Usuario.objects.count()
        
        data = {'asset_count': asset_count, 'employee_count': employee_count}
        
        return Response(data, status=200)

# Asset
class AssetInformationAllView(APIView):
    def get(self, request):
        assets = Asset.objects.all()
        serializer = AssetSerializer(assets, many=True)
        
        return Response(serializer.data, status=200)
    
class AssetInformationByIDView(APIView):
    def get(self, request):
        data = {}
        logger = logging.getLogger(__name__)
        
        asset_id = request.data.get('id')
        logger.error(f'asset_id: {asset_id}')
        
        asset = Asset.objects.get(id=asset_id)
        logger.error(f'asset: {asset}')
        
        for field in Asset._meta.fields:
            if field.name == 'id_categoria':
                category_id = asset.id_categoria
                if category_id != None and category_id != '':
                    category = Categorias.objects.get(id=category_id).categoria
                    data[field.name] = category
                else:
                    data[field.name] = ''
            
            elif field.name == 'id_estatus':
                status_id = asset.id_estatus
                if status_id != None and status_id != '':
                    status = Estados.objects.get(id=status_id).estatus
                    data[field.name] = status
                else:
                    data[field.name] = ''
            
            elif field.name == 'id_usuario':
                user_id = asset.id_usuario
                if user_id != None and user_id != '':
                    user = Usuario.objects.get(id=user_id).nombre
                    data[field.name] = user
                else:
                    data[field.name] = ''
            
            elif field.name == 'id_area':
                area_id = asset.id_area
                if area_id != None and area_id != '':
                    area = Areas.objects.get(id=area_id).area
                    data[field.name] = area
                else:
                    data[field.name] = ''
            
            elif field.name == 'imagen':
                imagen = asset.imagen
                data[field.name] = 'api/assets_imgs/' + str(imagen) + '.jpg'
        
            else:
                data[field.name] = getattr(asset, field.name)
                
        return Response(data, status=200)
        
class CreateAssetView(APIView):
    def post(self, request):
        logger = logging.getLogger(__name__)
        data = request.data
        logger.error(f'data: {data}')
        new_asset_data = {}
        print(request)
        print(request.FILES)
        for field in Asset._meta.fields:
            if field.name in data:
                    new_asset_data[field.name] = data[field.name]

        new_asset_data['fecha_registro'] = datetime.now().date()
                
        new_asset = Asset(**new_asset_data)
        new_asset.save()
                
        return Response({'mensaje': 'Registro exitoso'}, status=200)

class DeleteAssetView(APIView):
    def post(self, request):
        asset_id = request.data.get('id')
        
        asset = Asset.objects.get(id=asset_id)
        asset.delete()
        
        return Response({'mensaje': 'Eliminado correctamente'}, status=200)
    
class EditAssetView(APIView):
    def post(self, request):
        data = request.data
        asset_id = request.data.get('id')
        asset = Asset.objects.get(id=asset_id)
                    
        for field in Asset._meta.fields:
            if field.name in data:
                    setattr(asset, field.name, data[field.name])
        asset.save()
                        
        return Response({'mensaje': 'Editado correctamente'}, status=200)

class GetStatusCategoriesView(APIView):
    def get(self, request):
        data = {}
        id_categoria = request.data.get('id_categoria')
        id_estatus = request.data.get('id_estatus')
        
        try:
            category = Categorias.objects.get(id=id_categoria).categoria
            status = Estados.objects.get(id=id_estatus).estatus
            data["categoria"] = category
            data["estaus"] = status
            return Response(data, status=200)
        except ObjectDoesNotExist as e:
            return Response({'error': str(e)}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

# Users
class GetUsersAllView(APIView):
    def get(self, request):
        users = Usuario.objects.all()
        
        serializer = UsuarioSerializer(users, many=True)
        return Response(serializer.data, status=200)

class CreateUserView(APIView):
    def post(self, request):
        logger = logging.getLogger(__name__)

        data = request.data
        logger.error(f'data: {data}')
        new_user_data = {}
        
        for field in Usuario._meta.fields:
            if field.name in data:
                    new_user_data[field.name] = data[field.name]
                
        new_user = Usuario(**new_user_data)
        new_user.save()
        
        return Response({'mensaje': 'Registro exitoso'}, status=200)

class EditUserByIDView(APIView):
    def post(self, request):
        data = request.data
        id_user = request.data.get('id_user')
        user = Usuario.objects.get(id=id_user)
        
        for field in Usuario._meta.fields:
            if field.name in data:
                    setattr(user, field.name, data[field.name])
                
        user.save()
                
        return Response({'mensaje': 'Editado correctamente'}, status=200)

class DeleteUserByIDView(APIView):
    def post(self, request):
        id_user = request.data.get('id_user')
        
        user = Usuario.objects.get(id=id_user)
        user.delete()
        
        return Response({'mensaje': 'Eliminado correctamente'}, status=200)
    
# Departments
class GetDepartmentsAllView(APIView):
    def get(self, request):
        departments = Departamento.objects.all()
        
        serializer = DepartamentoSerializer(departments, many=True)
        return Response(serializer.data, status=200)
    
# Permissions
class GetPermissionsAllView(APIView):
    def get(self, request):
        permissions = Permiso.objects.all()
        
        serializer = PermisoSerializer(permissions, many=True)
        return Response(serializer.data, status=200)

# Categories
class GetCategoriesAllView(APIView):
    def get(self, request):
        categories = Categorias.objects.all()
        
        serializer = CategoriasSerializer(categories, many=True)
        return Response(serializer.data, status=200)
    
class CreateCategoryView(APIView):
    def post(self, request):
        data = request.data
        new_category_data = {}
        
        for field in Categorias._meta.fields:
            if field.name in data:
                    new_category_data[field.name] = data[field.name]
                
        new_category = Categorias(**new_category_data)
        new_category.save()
        
        return Response({'mensaje': 'Registro exitoso'}, status=200)

class EditCategoryByIDView(APIView):
    def post(self, request):
        data = request.data
        id_category = request.data.get('id_category')
        category = Categorias.objects.get(id=id_category)
        
        for field in Categorias._meta.fields:
            if field.name in data:
                    setattr(category, field.name, data[field.name])
                
        category.save()
                
        return Response({'mensaje': 'Editado correctamente'}, status=200)

class DeleteCategoryByIDView(APIView):
    def post(self, request):
        id_category = request.data.get('id_category')
        
        category = Categorias.objects.get(id=id_category)
        category.delete()
        
        return Response({'mensaje': 'Eliminado correctamente'}, status=200)

# States
class GetStatesAllView(APIView):
    def get(self, request):
        states = Estados.objects.all()
        
        serializer = EstadosSerializer(states, many=True)
        return Response(serializer.data, status=200)
    
class CreateStatusView(APIView):
    def post(self, request):
        data = request.data
        new_status_data = {}
        
        for field in Estados._meta.fields:
            if field.name in data:
                    new_status_data[field.name] = data[field.name]
                
        new_status = Estados(**new_status_data)
        new_status.save()
        
        return Response({'mensaje': 'Registro exitoso'}, status=200)

class EditStatusByIDView(APIView):
    def post(self, request):
        data = request.data
        id_status = request.data.get('id_status')
        status = Estados.objects.get(id=id_status)
        
        for field in Estados._meta.fields:
            if field.name in data:
                    setattr(status, field.name, data[field.name])
                
        status.save()
                
        return Response({'mensaje': 'Editado correctamente'}, status=200)

class DeleteStatusByIDView(APIView):
    def post(self, request):
        id_status = request.data.get('id_status')
        
        status = Estados.objects.get(id=id_status)
        status.delete()
        
        return Response({'mensaje': 'Eliminado correctamente'}, status=200)

# Areas
class GetAreasAllView(APIView):
    def get(self, request):
        areas = Areas.objects.all()
        
        serializer = AreasSerializer(areas, many=True)
        return Response(serializer.data, status=200)

class CreateAreaView(APIView):
    def post(self, request):
        data = request.data
        new_area_data = {}
        
        for field in Areas._meta.fields:
            if field.name in data:
                    new_area_data[field.name] = data[field.name]
                
        new_area = Areas(**new_area_data)
        new_area.save()
        
        return Response({'mensaje': 'Registro exitoso'}, status=200)

class EditAreaByIDView(APIView):
    def post(self, request):
        data = request.data
        id_area = request.data.get('id_area')
        area = Areas.objects.get(id=id_area)
        
        for field in Areas._meta.fields:
            if field.name in data:
                    setattr(area, field.name, data[field.name])
                
        area.save()
                
        return Response({'mensaje': 'Editado correctamente'}, status=200)

class DeleteAreaByIDView(APIView):
    def post(self, request):
        id_area = request.data.get('id_area')
        
        area = Areas.objects.get(id=id_area)
        area.delete()
        
        return Response({'mensaje': 'Eliminado correctamente'}, status=200)

# Unidades de Medida
class GetUnidadMedidaAllView(APIView):
    def get(self, request):
        unidad_medida = UnidadMedida.objects.all()
        
        serializer = UnidadMedidaSerializer(unidad_medida, many=True)
        return Response(serializer.data, status=200)

class CreateUnidadMedidaView(APIView):
    def post(self, request):
        data = request.data
        new_unidad_medida_data = {}
        
        for field in UnidadMedida._meta.fields:
            if field.name in data:
                    new_unidad_medida_data[field.name] = data[field.name]
                
        new_unidad_medida = UnidadMedida(**new_unidad_medida_data)
        new_unidad_medida.save()
        
        return Response({'mensaje': 'Registro exitoso'}, status=200)

class EditUnidadMedidaByIDView(APIView):
    def post(self, request):
        data = request.data
        id_unidad_medida = request.data.get('id')
        unidad_medida = UnidadMedida.objects.get(id=id_unidad_medida)
        
        for field in UnidadMedida._meta.fields:
            if field.name in data:
                    setattr(unidad_medida, field.name, data[field.name])
                
        unidad_medida.save()
                
        return Response({'mensaje': 'Editado correctamente'}, status=200)

class DeleteUnidadMedidaByIDView(APIView):
    def post(self, request):
        id_unidad_medida = request.data.get('id')
        
        unidad_medida = UnidadMedida.objects.get(id=id_unidad_medida)
        unidad_medida.delete()
        
        return Response({'mensaje': 'Eliminado correctamente'}, status=200)
    
# Estado de Pedimento
class GetEstadoPedimentoAllView(APIView):
    def get(self, request):
        estado_pedimento = EstadoPedimento.objects.all()
        
        serializer = EstadoPedimentoSerializer(estado_pedimento, many=True)
        return Response(serializer.data, status=200)

class CreateEstadoPedimentoView(APIView):
    def post(self, request):
        data = request.data
        new_estado_pedimento_data = {}
        
        for field in EstadoPedimento._meta.fields:
            if field.name in data:
                    new_estado_pedimento_data[field.name] = data[field.name]
                
        new_estado_pedimento = EstadoPedimento(**new_estado_pedimento_data)
        new_estado_pedimento.save()
        
        return Response({'mensaje': 'Registro exitoso'}, status=200)

class EditEstadoPedimentoByIDView(APIView):
    def post(self, request):
        data = request.data
        id_estado_pedimento = request.data.get('id')
        estado_pedimento = EstadoPedimento.objects.get(id=id_estado_pedimento)
        
        for field in EstadoPedimento._meta.fields:
            if field.name in data:
                    setattr(estado_pedimento, field.name, data[field.name])
                
        estado_pedimento.save()
                
        return Response({'mensaje': 'Editado correctamente'}, status=200)

class DeleteEstadoPedimentoByIDView(APIView):
    def post(self, request):
        id_estado_pedimento = request.data.get('id')
        
        estado_pedimento = EstadoPedimento.objects.get(id=id_estado_pedimento)
        estado_pedimento.delete()
        
        return Response({'mensaje': 'Eliminado correctamente'}, status=200)

# Export to csv
class ExportAssetsCsvView(APIView):
    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="assets.csv"'

        writer = csv.writer(response)
        writer.writerow(['ID', 'Numero de Serie', 'Modelo', 'Descripcion', 'Marca',
                        'Categoria', 'Fecha de Registro', 'Estatus', 'Tipo de Compra',
                        'No. Factura/Pedimento', 'Usuario', 'Area'])

        assets = Asset.objects.all()

        for asset in assets:
            category_id = asset.id_categoria
            if category_id != None and category_id != '':
                category = Categorias.objects.get(id=category_id).categoria
            else:
                category = ''
            
            status_id = asset.id_estatus
            if status_id != None and status_id != '':
                status = Estados.objects.get(id=status_id).estatus
            else:
                status = ''
            
            user_id = asset.id_usuario
            if user_id != None and user_id != '':
                user = Usuario.objects.get(id=user_id).nombre
            else:
                user = ''
            
            area_id = asset.id_area
            if area_id != None and area_id != '':
                area = Areas.objects.get(id=area_id).area
            else:
                area = ''
            
            writer.writerow([asset.id, asset.numero_serie, asset.modelo, asset.descripcion,
                            asset.marca, category, asset.fecha_registro, status,
                            asset.tipo_compra, asset.noFactura,
                            user, area])

        return response

# Labels
class GenerateLabelsPDFView(APIView):
    def get(self, request):
        try:
            make_pdf()
            return Response({'mensaje': 'Creado Correctamente'}, status=200)
        
        except Exception as e:
            return Response("Error: {}".format(str(e)))

class GenerateLabelByIDView(APIView):
    def get(self, request):
        _id = request.data.get('id')
        try:
            get_page_pdf(_id)
        
            return Response({'mensaje': 'Correcto'}, status=200)
        except Exception as e:
            return Response("Error: {}".format(str(e)))
        
class GenerateSelectLabelsPDFView(APIView):
    def get(self, request):
        try:
            data = request.data
        
            if 'ids' in data:
                ids = data['ids']
            
                get_pages_pdf(ids)
            
                return Response({'mensaje': 'Correcto'}, status=200)
            else:
                return Response({'mensaje': 'El JSON no contiene el campo "ids"'}, status=400)
        except Exception as e:
            return Response("Error: {}".format(str(e)))
        
def asset_info_qr(request, id):
    asset = get_object_or_404(Asset, id=id)

    # Obtener categoria, estado y area sin lanzar error 404
    categoria = Categorias.objects.filter(id=asset.id_categoria).first()
    estado = Estados.objects.filter(id=asset.id_estatus).first()
    area = Areas.objects.filter(id=asset.id_area).first()
    estado_pedimento = EstadoPedimento.objects.filter(id=asset.estado_pedimento).first()
    unidad_medida = UnidadMedida.objects.filter(id=asset.unidad_medida).first()

    # Establecer valores por defecto si no se encuentran los objetos
    categoria_nombre = categoria.categoria if categoria else "Sin asignar"
    estado_nombre = estado.estatus if estado else "Sin asignar"
    area_nombre = area.area if area else "Sin asignar"
    estado_pedimento_nombre = estado_pedimento.estado_pedimento if estado_pedimento else "Sin asignar"
    unidad_medida_nombre = unidad_medida.unidad_medida if unidad_medida else "Sin asignar"

    imageName = asset.imagen
    #image = '../api/files/' + str(imageName)
    
    context = {
        'Id': asset.id,
        'NoSerie': asset.numero_serie,
        'AssetModelNo': asset.modelo,
        'Description': asset.descripcion,
        'descripcion_ingles': asset.descripcion_ingles,
        'Category': categoria_nombre,
        'UnitPrice': asset.tipo_compra,
        'Area': area_nombre,
        'AssetStatus': estado_nombre,
        'register_date': asset.fecha_registro,
        'factura_date': asset.fecha_factura,
        'estado_pedimento': estado_pedimento_nombre,
        'unidad_medida': unidad_medida_nombre,
        'NoPedimento': asset.noPedimento,
        'NoFactura': asset.noFactura,
        'Mark': asset.marca,
        'Comments': asset.comentarios,
        'Image':  imageName,
    }

    return render(request, str(asset_info_html), context)

# Upload and Import
class UploadFile(APIView):
    def post(self, request):
        if request.method == 'POST':
            file_key = None
            if 'image' in request.FILES:
                file_key = 'image'
            elif 'pdf' in request.FILES:
                file_key = 'pdf'

            if file_key:
                try:
                    file = request.FILES[file_key]
                    fs = FileSystemStorage()
                    custom_filename = request.data.get('filename', file.name)

                    # Eliminar archivo existente si tiene el mismo nombre
                    if fs.exists(custom_filename):
                        file_path = fs.path(custom_filename)
                        os.remove(file_path)

                    filename = fs.save(custom_filename, file)
                    uploaded_file_url = fs.url(filename)
                    return Response({
                        'mensaje': f'{file_key.upper()} subido exitosamente.',
                        'file': uploaded_file_url
                    }, status=200)
                except Exception as e:
                    return Response({'error': str(e)}, status=400)
            else:
                return Response({'error': 'No se ha enviado ningún archivo.'}, status=400)
        else:
            return Response({'error': 'Método no permitido.'}, status=405)
        
class CreatePDF(APIView):
    def get(self, request):
        try:
            make_pdf()
            return Response({'mensaje': 'Subido exitosamente.'}, status=200)
        except Exception as e:
            return Response({'error': str(e)}, status=400)

class ImportCSV(APIView):
    def post(self, request):
        if request.method == 'POST' and 'csv' in request.FILES:
            try:
                fileCSV = request.FILES['csv']
                if not fileCSV.name.endswith('.csv'):
                    return Response({"mensaje": "El archivo no es CSV."}, status=400)

                # Leer el archivo CSV
                file_data = fileCSV.read().decode('utf-8')
                csv_data = csv.reader(io.StringIO(file_data))

                columns = {
                    'Número de Serie': None,
                    'Modelo': None,
                    'Descripción Español': None,
                    'Marca': None,
                    'Número de Factura': None,
                    'Número de Pedimento': None,
                    'Descripción Ingles': None,
                    'País Origen': None,
                    'Fecha Pedimento': None,
                }

                isFirstCycle = True

                for row in csv_data:
                    if isFirstCycle:
                        # Verificar los índices de las columnas requeridas
                        for index, column_name in enumerate(row):
                            if column_name in columns:
                                columns[column_name] = index
                        # Verificar que todos los campos requeridos están presentes
                        if None in columns.values():
                            missing_columns = [key for key, value in columns.items() if value is None]
                            return Response({"mensaje": f"Faltan columnas requeridas en el CSV: {', '.join(missing_columns)}"}, status=400)
                        isFirstCycle = False
                    else:
                        # Crear la instancia de Asset usando los índices dinámicos
                        Asset.objects.create(
                            numero_serie=row[columns['Número de Serie']],
                            modelo=row[columns['Modelo']],
                            descripcion=row[columns['Descripción Español']],
                            marca=row[columns['Marca']],
                            fecha_registro=datetime.now().date(),
                            tipo_compra="",
                            noFactura=row[columns['Número de Factura']],
                            noPedimento=row[columns['Número de Pedimento']],
                            descripcion_ingles=row[columns['Descripción Ingles']],
                            pais_origen=row[columns['País Origen']],
                        )

                # Llamar a la función make_pdf si es necesario
                make_pdf()
                return Response({'mensaje': 'CSV enviado exitosamente.'}, status=200)
                
            except Exception as e:
                # Capturar más detalles sobre el error para depuración
                return Response({"mensaje": f"Error procesando el archivo CSV: {str(e)}"}, status=500)
        
        return Response({"mensaje": "Solicitud inválida o archivo CSV no encontrado."}, status=400)