import { useState, useEffect } from "react";
import axios from "axios";

export function PerfumesList() {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Keep track of current page
  const [totalPages, setTotalPages] = useState(1); // Store total pages from API

  // Function to fetch perfumes from the API
  const fetchPerfumes = (page = 1) => {
    setLoading(true); // Start loading
    axios
      .get(`http://localhost/dashboard/first2/public/perfumes?page=${page}`)
      .then((response) => {
        setPerfumes(response.data.data); // Store fetched perfumes
        setTotalPages(response.data.last_page); // Get total pages from API
        setCurrentPage(page); // Update current page
        setLoading(false); // Set loading to false once data is loaded
      })
      .catch((err) => {
        setError("Error fetching data");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPerfumes(currentPage); // Fetch perfumes when the component mounts
  }, [currentPage]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Perfume Collection</h1>
      <div className="row">
        {perfumes.map((perfume, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="card h-100 shadow-lg border-light rounded">
              {/* If there's an image */}
              {perfume.image ? (
                <img
                  src={perfume.image}
                  alt={perfume.name}
                  className="card-img-top img-fluid"
                  style={{ height: '200px', objectFit: 'cover' }} // Ensure images have a consistent height
                />
              ) : (
                <div className="card-img-top d-flex justify-content-center align-items-center bg-light" style={{ height: '200px' }}>
                  <span className="text-muted">No Image Available</span>
                </div>
              )}
              <div className="card-body">
                <h5 className="card-title text-center">{perfume.name}</h5>
                <p className="card-text"><strong>Size:</strong> {perfume.size} ml</p>
                <p className="card-text"><strong>Price:</strong> ${perfume.prodajna_cijena}</p>
                <div className="d-flex justify-content-center">
                  <button className="btn btn-primary">Buy Now</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <nav aria-label="Perfume pagination">
        <ul className="pagination justify-content-center">
          {/* Previous Button */}
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>
          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, index) => (
            <li
              key={index}
              className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
          {/* Next Button */}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
