import Xarrow from "react-xarrows";

const Synapse = ({ synapse }) => {
  return (
    <Xarrow
      start={synapse.pre.toString()}
      end={synapse.post.toString()}
      lineColor="black"
      headColor="black"
      labels=<p
        style={{
          color: "white",
          fontWeight: "bold",
        }}
      >
        {"w:" + synapse.w + " d:" + synapse.d}
      </p>
      passProps={{
        //onClick: this.handleArrowClick,
        cursor: "pointer",
      }}
      strokeWidth={3}
    />
  );
};

export default Synapse;
