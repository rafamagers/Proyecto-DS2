import NavBar from "../components/Navbar";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <NavBar />
      <main className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center">
            <h1 className="display-4">404</h1>
            <h2 className="lead">Page not found</h2>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ErrorPage;
