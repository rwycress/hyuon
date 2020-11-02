from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.validators import validate_comma_separated_integer_list
# Create your models here.


class DefaultUser(AbstractUser):
    nickname = models.CharField(max_length=100)


class Rest(models.Model):
    rest_name = models.CharField(max_length=100)
    rest_address = models.CharField(max_length=100)
    rest_high = models.CharField(max_length=100, null=True)
    rest_highdirect = models.CharField(max_length=100, null=True)
    rest_coordinate = models.CharField(max_length=100)
    # rest_service = models.CharField(max_length=100)
    # rest_opentime = models.CharField(max_length=100)
    rest_fix = models.BooleanField(default=False)
    rest_truck = models.BooleanField(default=False)
    rest_feeding = models.BooleanField(default=False)
    rest_sleep = models.BooleanField(default=False)
    rest_shower = models.BooleanField(default=False)
    rest_drug = models.BooleanField(default=False)
    rest_laundary = models.BooleanField(default=False)


class RestComment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    rest = models.ForeignKey(Rest, on_delete=models.CASCADE)
    comment_content = models.TextField()
    comment_create = models.DateTimeField(auto_now_add=True)
    # comment_edit = models.DateTimeField(auto_now=True)


# class Highway(models.Model):
#     high_name = models.CharField(max_length=100)
#     high_direct = models.CharField(max_length=100)


class RestMenu(models.Model):
    rest = models.ForeignKey(Rest, on_delete=models.CASCADE, null=True)
    rest_name = models.CharField(max_length=100)
    menu_name = models.CharField(max_length=100)
    menu_price = models.CharField(max_length=100)
    menu_best = models.CharField(max_length=100)


class ExFood(models.Model):
    rest = models.OneToOneField(Rest, on_delete=models.CASCADE, null=True)
    ex_rest = models.CharField(max_length=100)
    ex_name = models.CharField(max_length=100)
    ex_price = models.CharField(max_length=100)
    ex_img = models.CharField(max_length=100)
    ex_info = models.CharField(max_length=100)


class BrandShop(models.Model):
    rest = models.ForeignKey(Rest, on_delete=models.CASCADE, null=True)
    brand_name = models.CharField(max_length=100)
    brand_opentime = models.CharField(max_length=100)


class TopItem(models.Model):
    rest = models.ForeignKey(Rest, on_delete=models.CASCADE, null=True)
    rest_name = models.CharField(max_length=100)
    rank = models.IntegerField()
    top_shop = models.CharField(max_length=100)
    top_item = models.CharField(max_length=100)
