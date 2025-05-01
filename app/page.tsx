// app/page.tsx lub components/Home.tsx
export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #001f3f, #0074D9)",
        color: "white",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <img
        src="/orca.png"
        alt="Orca Logo"
        style={{
          width: "200px",
          height: "auto",
          marginBottom: "2rem",
          filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))",
        }}
      />
      <h1 style={{ fontSize: "2.5rem", fontWeight: 600 }}>Orca</h1>
      <p style={{ fontSize: "1.2rem", marginTop: "0.5rem", opacity: 0.8 }}>
    
    
      </p>
    </main>
  );
}
