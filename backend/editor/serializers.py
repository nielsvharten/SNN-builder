from rest_framework import serializers

from .models import Network, LIF


class LIFSerializer(serializers.ModelSerializer):
    class Meta:
        model = LIF
        fields = ['name', 'm', 'V_reset', 'thr']


class NetworkSerializer(serializers.ModelSerializer):
    lifs = LIFSerializer(many=True, read_only=True)

    class Meta:
        model = Network
        fields = ['id', 'name', 'lifs', 'input_trains', 'synapses']
