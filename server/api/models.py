from django.db import models

class Departamento(models.Model):
    departamento = models.CharField(max_length=100)

    def __str__(self):
        return self.departamento

class Permiso(models.Model):
    permiso = models.CharField(max_length=100)

    def __str__(self):
        return self.permiso

class Usuario(models.Model):
    nombre = models.CharField(max_length=100)
    contraseña = models.CharField(max_length=100)
    id_departamento = models.IntegerField(null=True)
    id_permiso = models.IntegerField(null=True)

    def __str__(self):
        return self.nombre
    
class Categorias(models.Model):
    categoria = models.CharField(max_length=100)

    def __str__(self):
        return self.categoria
    
class Estados(models.Model):
    estatus = models.CharField(max_length=100)

    def __str__(self):
        return self.estatus
    
class Areas(models.Model):
    area = models.CharField(max_length=100)

    def __str__(self):
        return self.area
    
def upload_path(filename):
    return '/'.join(['images'], filename)

class Asset(models.Model):
    numero_serie = models.CharField(max_length=100)
    modelo = models.CharField(max_length=100)
    descripcion = models.TextField(null=True, blank=True)
    marca = models.CharField(max_length=100)
    id_categoria = models.IntegerField(null=True)
    imagen = models.ImageField(upload_to=upload_path, null=True, blank=True)
    fecha_registro = models.DateField()
    id_estatus = models.IntegerField(null=True)
    tipo_compra = models.CharField(max_length=100)
    noFactura_pedimento = models.TextField(null=True, blank=True)
    factura_pedimentoPDF = models.TextField(null=True, blank=True)
    id_usuario = models.IntegerField(null=True)
    id_area = models.IntegerField(null=True)
    
    def __str__(self):
        return self.numero_serie
    