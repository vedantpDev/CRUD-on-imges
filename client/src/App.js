import { signOut } from "firebase/auth";
import { auth } from "./firebase/db";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const imgInputRef = useRef(null);
  const [img, setImg] = useState("");
  const [allImages, setAllImages] = useState([]);
  const [imgData, setimgData] = useState();
  const [updateImgId, setUpdateImgId] = useState();
  const [updatedImg, setUpdatedImg] = useState("");
  const [updateImgData, setUpdateImgData] = useState("");
  const [reRender, setReRender] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/api/getAllImages`)
      .then((res) => {
        setAllImages(res.data.data);
      })
      .catch((err) => console.log(err));
  }, [reRender]);

  const handleSignOut = async (e) => {
    e.preventDefault();
    await signOut(auth)
      .then((res) => {
        localStorage.removeItem("accessToken");
        navigate("/login-page");
      })
      .catch((err) => alert("error signing out"));
  };

  const handleFile = (e) => {
    e.preventDefault();
    setimgData(e.target.files[0]);
    setImg(URL.createObjectURL(e.target.files[0]));
  };

  const handleUploadImg = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", imgData);
    await axios
      .post(`${process.env.REACT_APP_SERVER_URL}/api/uploadImg`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setReRender(!reRender);
        setimgData();
        setImg("");
        imgInputRef.current.value = "";
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = async (e, id, imgPath) => {
    e.preventDefault();
    await axios
      .post(`${process.env.REACT_APP_SERVER_URL}/api/deleteImg`, {
        imgId: id,
        imgPath,
      })
      .then((res) => setReRender(!reRender))
      .catch((err) => console.log(err));
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    setUpdateImgId(id);
  };

  const handleUpdateFile = (e, id) => {
    e.preventDefault();
    setUpdateImgData(e.target.files[0]);
    setUpdatedImg(URL.createObjectURL(e.target.files[0]));
  };

  const handleUploadNewImg = async (e, id, imgPath) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", updateImgData);
    data.append("imgId", id);
    data.append("prevImgPath", imgPath);
    await axios
      .post(`${process.env.REACT_APP_SERVER_URL}/api/updateImg`, data)
      .then((res) => {
        setUpdateImgId();
        setUpdatedImg("");
        setReRender(!reRender);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex justify-center">
      <div className="p-4 border border-gray-300 rounded-lg shadow-md w-1/2">
        <form
          encType="multipart/form-data"
          className="rounded-lg border p-4 m-4"
        >
          <input
            type="file"
            name="file"
            ref={imgInputRef}
            onChange={(e) => handleFile(e)}
          />
        </form>

        <div>
          {img && (
            <form onSubmit={handleUploadImg} className="m-4">
              <div className="text-center">
                <img className="h-64 w-64" src={img} alt="Uploaded" />
              </div>
              <button
                className="w-full bg-green-500 text-white py-2 rounded-md"
                type="submit"
              >
                Upload Img
              </button>
            </form>
          )}

          {allImages && (
            <div className="flex justify-center">
              <table className="w-[80%]">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allImages.map((data, i) => (
                    <tr key={i}>
                      <td className="flex justify-center">
                        <img
                          src={`/${data.imgPath}`}
                          alt={`Image ${i}`}
                          className="h-32 w-32"
                        />
                      </td>
                      <td>
                        {updateImgId === data.imgId && (
                          <input
                            type="file"
                            name="file"
                            onChange={(e) => handleUpdateFile(e, data.imgId)}
                          />
                        )}
                      </td>
                      <td className="flex w-full">
                        {updateImgId === data.imgId && updatedImg ? (
                          <>
                            <img
                              src={updatedImg}
                              alt={`Image ${i}`}
                              className="h-32 w-32"
                            />
                            <button
                              className="bg-blue-500 text-white py-2 rounded-md ml-2"
                              onClick={(e) =>
                                handleUploadNewImg(e, data.imgId, data.imgPath)
                              }
                            >
                              Upload New Image
                            </button>
                          </>
                        ) : (
                          <button
                            className="bg-blue-500 text-white py-2 rounded-md ml-2 w-full"
                            onClick={(e) => handleUpdate(e, data.imgId)}
                          >
                            Update
                          </button>
                        )}

                        <button
                          className="bg-red-500 text-white py-2 rounded-md ml-2 w-full"
                          onClick={(e) =>
                            handleDelete(e, data.imgId, data.imgPath)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <button
          onClick={handleSignOut}
          className="w-full bg-red-500 text-white py-2 rounded-md mt-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default App;
