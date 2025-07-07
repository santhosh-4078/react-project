import "./Loader.css";

export default function Loader({ size = 24, color = "#3b82f6" }: { size?: number; color?: string }) {
  return (
    <div
      className="custom-loader"
      style={{
        width: size,
        height: size,
        borderTopColor: color,
      }}
    />
  );
}