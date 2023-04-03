import Xarrow from "react-xarrows";
import Loop from "./Loop";

function getSynapseLabel(synapse, selected, onClickSynapse, bundle = false) {
  let className = "synapse-label";
  className += bundle ? " bundle" : "";
  className += selected ? " selected" : "";

  return (
    <p className={className} onClick={() => onClickSynapse(synapse.id)}>
      {"w=" + synapse.w + " d=" + synapse.d}
    </p>
  );
}

const Connection = ({
  preNode,
  synapses,
  selectedSynapseId,
  onClickSynapse,
}) => {
  const bundle = synapses.length > 1;

  let color = "black";
  if (synapses.find((synapse) => synapse.id === selectedSynapseId)) {
    color = "blue";
  }

  let props = {};
  if (!bundle) {
    props = {
      onClick: () => onClickSynapse(synapses[0].id),
      cursor: "pointer",
    };
  }

  const labels = (
    <div>
      {synapses.map((synapse) =>
        getSynapseLabel(
          synapse,
          selectedSynapseId === synapse.id,
          onClickSynapse,
          bundle
        )
      )}
    </div>
  );

  if (synapses[0].pre === synapses[0].post) {
    // synapse connects neuron to itself
    return (
      <Loop
        x={preNode.x}
        y={preNode.y}
        color={color}
        labels={labels}
        onClickSynapse={() => onClickSynapse(synapses[0].id)}
      />
    );
  } else {
    // synapse connects neuron to another
    return (
      <Xarrow
        start={synapses[0].pre.toString()}
        end={synapses[0].post.toString()}
        lineColor={color}
        headColor={color}
        labels={labels}
        passProps={props}
        strokeWidth={3}
      />
    );
  }
};

export default Connection;
