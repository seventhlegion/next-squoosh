import { Image } from "passepartout";

function App() {
  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div style={{ display: "grid", gap: "2rem", marginTop: "2rem" }}>
        <Image src="/test1.png" alt="test1" width={1000} height={1000} />
      </div>
    </div>
  );
}

export default App;
