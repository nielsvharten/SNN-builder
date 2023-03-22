import Xarrow from "react-xarrows";

const Synapse = ({ synapse, selected, onClickSynapse }) => {
  let color = "black";
  if (selected) {
    color = "blue";
  }

  if (synapse.pre === synapse.post) {
    // TODO: loop to itself, should be visible
  }

  return (
    <Xarrow
      start={synapse.pre.toString()}
      end={synapse.post.toString()}
      lineColor={color}
      headColor={color}
      labels=<p
        style={{
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
        }}
        onClick={() => onClickSynapse(synapse.id)}
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
