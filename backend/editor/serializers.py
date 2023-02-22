from rest_framework import serializers

from .models import Network, AbstractNode, LIF, InputTrain


class NodeSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):

        try:
            return LIFSerializer(instance=instance.lif).data
        except LIF.DoesNotExist:
            pass

        try:
            return InputTrainSerializer(instance=instance.inputtrain).data
        except InputTrain.DoesNotExist:
            pass

        return super().to_representation(instance)
    

class LIFSerializer(serializers.ModelSerializer):
    class Meta:
        model = LIF
        fields = "__all__"#['id', 'name', 'x_pos', 'y_pos', 'm', 'V_reset', 'thr']


class InputTrainSerializer(serializers.ModelSerializer):
    class Meta:
        model = InputTrain
        fields = "__all__"


class NetworkSerializer(serializers.ModelSerializer):
    nodes = NodeSerializer(many=True, read_only=True)

    class Meta:
        model = Network
        fields = ['id', 'name', 'nodes', 'synapses']
