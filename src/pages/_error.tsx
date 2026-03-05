function Error({ statusCode }: { statusCode?: number }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "bold", color: "#111827" }}>
          {statusCode || "Error"}
        </h1>
        <p style={{ marginTop: "0.5rem", fontSize: "1.125rem", color: "#6B7280" }}>
          {statusCode === 404 ? "Page not found" : "Something went wrong"}
        </p>
        <a
          href="/"
          style={{ display: "inline-block", marginTop: "1.5rem", padding: "0.625rem 1.5rem", borderRadius: "0.75rem", backgroundColor: "#10B981", color: "white", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none" }}
        >
          Go home
        </a>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: { res?: { statusCode: number }; err?: { statusCode: number } }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
