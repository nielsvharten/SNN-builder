import Xarrow from "react-xarrows";

function getSynapseLabel(synapse, selected, onClickSynapse, bundle = false) {
  let border = "";
  if (bundle) {
    if (selected) {
      border = "2px dashed blue";
    } else {
      border = "1px dashed white";
    }
  }

  return (
    <p
      style={{
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        cursor: "pointer",
        marginBottom: 0,
        border: border,
        padding: "0px 4px",
      }}
      onClick={() => onClickSynapse(synapse.id)}
    >
      {"w=" + synapse.w + " d=" + synapse.d}
    </p>
  );
}

const Connection = ({ synapses, selectedSynapseId, onClickSynapse }) => {
  //console.log(synapses);
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

  return (
    <Xarrow
      start={synapses[0].pre.toString()}
      end={synapses[0].post.toString()}
      lineColor={color}
      headColor={color}
      labels=<div>
        {synapses.map((synapse) =>
          getSynapseLabel(
            synapse,
            selectedSynapseId === synapse.id,
            onClickSynapse,
            bundle
          )
        )}
      </div>
      passProps={props}
      strokeWidth={3}
    />
  );
};

export default Connection;
