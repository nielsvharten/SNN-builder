from rest_framework import serializers
from .models import Network, AbstractNode, LIF, InputTrain, Synapse


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
    
    class Meta:
        model = AbstractNode
        fields = "__all__"
    

class LIFSerializer(serializers.ModelSerializer):
    type = serializers.ReadOnlyField(default='lif')

    class Meta:
        model = LIF
        fields = "__all__"


class InputTrainSerializer(serializers.ModelSerializer):
    type = serializers.ReadOnlyField(default='input')
    class Meta:
        model = InputTrain
        fields = "__all__"


class SynapseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Synapse
        fields = "__all__"


class NetworkSerializer(serializers.ModelSerializer):
    nodes = NodeSerializer(many=True, read_only=True)
    synapses = SynapseSerializer(many=True, read_only=True)

    class Meta:
        model = Network
        fields = "__all__"
