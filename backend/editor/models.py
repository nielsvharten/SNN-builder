from django.db import models


class Network(models.Model):
    name = models.CharField('network name', max_length=200)

    def __str__(self):
        return self.name


class AbstractNode(models.Model):
    amplitude =  models.FloatField('amplitude of output', default=1.)
    name = models.CharField('neuron name', max_length=200)

    x_pos = models.CharField('horizontal position', max_length=10, default="100px")
    y_pos = models.CharField('vertical position', max_length=10, default="100px")

    def __str__(self):
        return self.name


class LIF(AbstractNode):
    net = models.ForeignKey(Network, related_name='lifs', on_delete=models.CASCADE, default=None)
    m = models.FloatField('inverse leakage', default=0.)
    V_init = models.FloatField('initial voltage', default=0.)
    V_reset = models.FloatField('reset voltage after spike', default=0.)
    thr = models.FloatField('spiking threshold', default=0.99)
    I_e = models.FloatField('constant input current', default=0.)
    noise = models.FloatField('membrane voltage noise', default=0.)
    # refrac_time = models.IntegerField('refractory period in time steps', default=0)


class InputTrain(AbstractNode):
    net = models.ForeignKey(Network, related_name='input_trains', on_delete=models.CASCADE, default=None)
    train = models.TextField('output train', max_length=9999)
    loop = models.BooleanField('loop the train', default=False)


class Synapse(models.Model):
    net = models.ForeignKey(Network, related_name='synapses', on_delete=models.CASCADE, default=None)
    pre = models.ForeignKey(AbstractNode, related_name='outgoing_synapses', on_delete=models.CASCADE)
    post = models.ForeignKey(AbstractNode, related_name='incoming_synapses', on_delete=models.CASCADE)
    
    w = models.FloatField('synaptic weight', default=1)
    d = models.IntegerField('synaptic delay (nr of timesteps)', default=1)

    def __str__(self):
        return 'from ' + self.source.name + ' to ' + self.target.name