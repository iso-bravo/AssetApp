from rest_framework import serializers
from .models import EstadoPedimento, UnidadMedida, Usuario, Departamento, Permiso, Asset, Areas, Estados, Categorias

class PermisoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permiso
        fields = '__all__'

class DepartamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departamento
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'
        
class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = '__all__'
        
class AreasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Areas
        fields = '__all__'

class EstadosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estados
        fields = '__all__'
        
class CategoriasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorias
        fields = '__all__'
        
class UnidadMedidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnidadMedida
        fields = '__all__'

class EstadoPedimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoPedimento
        fields = '__all__'

class AssetSerializerInformation(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = '__all__'

    area = serializers.SerializerMethodField()
    estado = serializers.SerializerMethodField()
    usuario = serializers.SerializerMethodField()
    categoria = serializers.SerializerMethodField()
    departamento = serializers.SerializerMethodField()

    def get_area(self, obj):
        return Areas.objects.get(id=obj.id_area).area if obj.id_area else 'N/A'

    def get_estado(self, obj):
        return Estados.objects.get(id=obj.id_estatus).estatus if obj.id_estatus else 'N/A'

    def get_usuario(self, obj):
        return Usuario.objects.get(id=obj.id_usuario).nombre if obj.id_usuario else 'N/A'

    def get_categoria(self, obj):
        return Categorias.objects.get(id=obj.id_categoria).categoria if obj.id_categoria else 'N/A'

    def get_departamento(self, obj):
        usuario = Usuario.objects.get(id=obj.id_usuario) if obj.id_usuario else None
        return Departamento.objects.get(id=usuario.id_departamento).departamento if usuario and usuario.id_departamento else 'N/A'