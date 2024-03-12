import Layout from "./Layout";

function Dashboard() {
  return (
    <Layout>
      <div className="flex">
        <img src="assets/chart.png" alt="" className="p-5 pl-0 w-1/2" />
        <img src="assets/fire-detect.png" alt="" className="p-5 pl-0 w-1/2" />
        </div>
        <div className="bg-gray flex space-x-4 items-center border border-1 border-primary shadow ml-6">
          <img src="/public/assets/camera.svg" className="w-[350px]" alt="" />
          <img src="/public/assets/Wilaya.svg" className="w-[600px]"/>
        </div>
        <img src="/public/assets/Basemap image.png" className="mx-auto mt-5 w-[800px]" alt="" />
      
    </Layout>
  );
}

export default Dashboard;
