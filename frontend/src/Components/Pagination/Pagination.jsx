import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const Pagination = ({ pages, currentPage, setCurrentPage }) => {
 const forward = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage+1);
    }
  };

  const backward = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage-1);
    }
  };

  return (
    <main className="flex justify-center items-center gap-2 fixed  bottom-40 left-1/2 -translate-x-1/2 z-50 mt-20">
      {/* Back */}
      <button
        onClick={backward}
        disabled={currentPage === 1}
        className="bg-indigo-500 disabled:opacity-40 cursor-pointer rounded-full h-10 w-10 flex items-center justify-center text-xl"
      >
        <IoIosArrowBack />
      </button>

      {/* Pages */}
      {pages.map(p => (
        <button
          key={p}
          onClick={() => setCurrentPage(p + 1)}
          className={`cursor-pointer rounded-full text-lg font-semibold h-10 w-10 transition-all duration-500
            ${
              currentPage === p + 1
                ? 'bg-indigo-500 text-white scale-110'
                : 'bg-white/10 backdrop-blur-lg text-white hover:bg-indigo-400/30'
            }`}
        >
          {p + 1}
        </button>
      ))}

      {/* Forward */}
      <button
        onClick={forward}
        disabled={currentPage === pages.length}
        className="bg-indigo-500 disabled:opacity-40 cursor-pointer rounded-full h-10 w-10 flex items-center justify-center text-xl"
      >
        <IoIosArrowForward />
      </button>
    </main>
  );
};

export default Pagination;
