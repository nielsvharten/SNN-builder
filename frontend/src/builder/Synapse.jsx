import Xarrow from "react-xarrows";

const Synapse = ({ synapse, selectedSynapseId, onClickSynapse }) => {
  let color = "black";
  if (selectedSynapseId === synapse.id) {
    color = "blue";
  }

  return (
    <Xarrow
      style={{ position: "relative" }}
      start={synapse.pre.toString()}
      end={synapse.post.toString()}
      lineColor={color}
      headColor={color}
      labels=<p
        style={{
          color: "white",
          fontWeight: "bold",
        }}
      >
        {"w=" + synapse.w + " d=" + synapse.d}
      </p>
      passProps={{
        onClick: () => onClickSynapse(synapse.id),
        cursor: "pointer",
      }}
      strokeWidth={3}
    />
  );
};

export default Synapse;
