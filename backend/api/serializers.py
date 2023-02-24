from rest_framework import serializers
from .models import Network, AbstractNode, LIF, InputTrain, Synapse
from rest_framework import exceptions

class NodeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

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
        abstract = True
    

class LIFSerializer(serializers.ModelSerializer):
    type = serializers.Field(default='lif')

    class Meta:
        model = LIF
        fields = "__all__"


class InputTrainSerializer(serializers.ModelSerializer):
    type = serializers.Field(default='input')
    class Meta:
        model = InputTrain
        fields = "__all__"


class SynapseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Synapse
        fields = "__all__"

#https://ilovedjango.com/django/rest-api-framework/update-data-using-api/
class NetworkSerializer(serializers.ModelSerializer):
    nodes = NodeSerializer(many=True, read_only=False)
    synapses = SynapseSerializer(many=True, read_only=False)
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        print(validated_data)
        nodes = validated_data.get('nodes')
        instance.nodes.all().delete()
        instance.synapses.all().delete()
        instance.save()
        
        for node in nodes:
            print(node)
            if node.get('type', None) == "lif":

                LIF.objects.create(net=instance, **node)
           
        print(LIF.objects.all())
        return instance



        new_nodes = NodeSerializer(data=validated_data.get('nodes', instance.nodes))
        new_synapses = SynapseSerializer(data=validated_data.get('synapses', instance.synapses))

        if new_nodes.is_valid() and new_synapses.is_valid():
            
            instance.nodes.set(new_nodes) #= 
            instance.synapses.set(new_synapses)
            instance.save()
        else:
            print(new_synapses.is_valid())

        return instance
    
    class Meta:
        model = Network
        fields = "__all__"

# NEXT: chceck how to update network on request