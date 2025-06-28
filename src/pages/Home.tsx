import logo from '../assets/trt_logo.svg';

function Home() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '2rem',
      }}
    >
      <img
        src={logo}
        alt="TRT Planner Logo"
        style={{ width: '120px', height: '120px' }}
      />
      <h1
        style={{
          fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
          color: '#003366',
          fontSize: '2.5rem',
          marginTop: '1rem',
        }}
      >
        TRT Planner
      </h1>
    </div>
  );
}

export default Home;
