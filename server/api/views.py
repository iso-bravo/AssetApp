import logging
from datetime import datetime

from django.contrib.auth import login
from rest_framework import status
from rest_framework import status as http_status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (Areas, Asset, Categorias, Departamento, Estados, Permiso, Usuario)
from .serializers import (AreasSerializer, AssetSerializer, CategoriasSerializer, EstadosSerializer, UsuarioSerializer)


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
        
class AssetAndEmployeesView(APIView):
    def get(self, request):
        asset_count = Asset.objects.count()
        employee_count = Usuario.objects.count()
        
        data = {'asset_count': asset_count, 'employee_count': employee_count}
        
        return Response(data, status=200)
        
class AssetInformationAllView(APIView):
    def get(self):
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
                if status_id != None and status_id != '':
                    user = Usuario.objects.get(id=user_id).nombre
                    data[field.name] = user
                else:
                    data[field.name] = ''
            
            elif field.name == 'id_area':
                area_id = asset.id_area
                if status_id != None and status_id != '':
                    area = Areas.objects.get(id=area_id).area
                    data[field.name] = area
                else:
                    data[field.name] = ''
        
            else:
                data[field.name] = getattr(asset, field.name)
                
        logger.error(f'data: {data}')
        return Response(data, status=200)
        
class CreateAssetView(APIView):
    def post(self, request):
        logger = logging.getLogger(__name__)
        data = request.data
        new_asset_data = {}
        
        for field in Asset._meta.fields:
            if field.name in data:
                if field.name == 'id_categoria':
                    category = data[field.name]
                    category_id = Categorias.objects.get(categoria=category).id
                    logger.error(f'category_id: {category_id}')
                    new_asset_data[field.name] = category_id
                    
                elif field.name == 'id_estatus':
                    status = data[field.name]
                    status_id = Estados.objects.get(estatus=status).id
                    new_asset_data[field.name] = status_id
                    
                elif field.name == 'id_usuario':
                    user = data[field.name]
                    logger.error(f'user: {user}')
                    user_id = Usuario.objects.get(nombre=user).id
                    logger.error(f'user_id: {user_id}')
                    new_asset_data[field.name] = user_id
                    
                elif field.name == 'id_area':
                    area = data[field.name]
                    area_id = Areas.objects.get(area=area).id
                    new_asset_data[field.name] = area_id
                    
                elif field.name == 'fecha_registro':
                    new_asset_data[field.name] = datetime.now().date()
                else:
                    new_asset_data[field.name] = data[field.name]
                
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
                if field.name == 'id_categoria':
                    category = data[field.name]
                    category_id = Categorias.objects.get(categoria=category).id
                    setattr(asset, field.name, category_id)
                    
                elif field.name == 'id_estatus':
                    status = data[field.name]
                    status_id = Estados.objects.get(estatus=status).id
                    setattr(asset, field.name, status_id)
                    
                elif field.name == 'id_usuario':
                    user = data[field.name]
                    user_id = Usuario.objects.get(nombre=user).id
                    setattr(asset, field.name, user_id)
                    
                elif field.name == 'id_area':
                    area = data[field.name]
                    area_id = Areas.objects.get(area=area).id
                    setattr(asset, field.name, area_id)
                    
                else:
                    setattr(asset, field.name, data[field.name])
                
        asset.save()
                
        return Response({'mensaje': 'Editado correctamente'}, status=200)
        
class GetUsersAllView(APIView):
    def get(self, request):
        users = Usuario.objects.all()
        
        serializer = UsuarioSerializer(users, many=True)
        return Response(serializer.data, status=200)
    
class GetCategoriesAllView(APIView):
    def get(self, request):
        categories = Categorias.objects.all()
        
        serializer = CategoriasSerializer(categories, many=True)
        return Response(serializer.data, status=200)
    
class GetStatesAllView(APIView):
    def get(self, request):
        states = Estados.objects.all()
        
        serializer = EstadosSerializer(states, many=True)
        return Response(serializer.data, status=200)

class GetAreasAllView(APIView):
    def get(self, request):
        areas = Areas.objects.all()
        
        serializer = AreasSerializer(areas, many=True)
        return Response(serializer.data, status=200)
    
class GetStatusCategoriesView(APIView):
    def get(self, request):
        data = {}
        id_categoria = request.data.get('id_categoria')
        id_estatus = request.data.get('id_estatus')
        
        category = Categorias.objects.get(id_categoria=id_categoria).categoria
        status = Estados.objects.get(id_estatus=id_estatus).estatus
        
        data[id_categoria] = category
        data[id_estatus] = status
        
        return Response(data, status=200)
