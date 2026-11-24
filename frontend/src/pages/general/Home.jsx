import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../styles/home.css";

import { AiOutlineHeart, AiFillHeart, AiOutlineHome } from "react-icons/ai";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [saved, setSaved] = useState([]);
  const [likes, setLikes] = useState({});
  // const [counts, setCounts] = useState({});
  const [commentBox, setCommentBox] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [allComments, setAllComments] = useState({});

  const videoRefs = useRef(new Map());
  const containerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const videos = videoRefs.current;

    axios
      .get("http://localhost:5000/api/food", { withCredentials: true })
      .then((response) => {
        if (isMounted) {
          const items = response.data.foodItems || response.data;
          setVideos(items);
        }
      })
      .catch((err) => console.error("Fetch error:", err));

    return () => {
      isMounted = false;

      videos.forEach((video) => {
        if (video) {
          video.pause();
          video.src = "";
        }
      });

      videos.clear();
    };
  }, []);

  const setVideoRef = (_id) => (el) => {
    if (!el) {
      videoRefs.current.delete(_id);
      return;
    }
    videoRefs.current.set(_id, el);
  };

  useEffect(() => {
    if (!videos.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => { });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.7 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [videos]);

  async function likeVideo(item) {
    const response = await axios.post(
      "http://localhost:3000/api/food/like",
      { foodId: item._id },
      { withCredentials: true }
    );

    const isLiked = response.data.liked;

    setLikes((prev) => ({
      //icon update
      ...prev,
      [item._id]: isLiked,
    }));

    setVideos(
      (
        prev //state count update
      ) =>
        prev.map((v) =>
          v._id === item._id
            ? { ...v, likeCount: isLiked ? v.likeCount + 1 : v.likeCount - 1 }
            : v
        )
    );
  }

  async function saveVideo(item) {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/food/save",
        { foodId: item._id },
        { withCredentials: true }
      );

      const isSaved = response.data.saved;

      setSaved((prev) => ({
        ...prev,
        [item._id]: isSaved,
      }));

      setVideos((prev) =>
        prev.map((v) =>
          v._id === item._id
            ? {
              ...v,
              savesCount: isSaved ? v.savesCount + 1 : v.savesCount - 1,
            }
            : v
        )
      );
    } catch (error) {
      console.log("Save error:", error);
    }
  }

  const openCommentBox = async (foodId) => {
    setCommentBox(foodId);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/comments/${foodId}`,
        { withCredentials: true }
      );

      setAllComments((prev) => ({
        ...prev,
        [foodId]: response.data.comments,
      }));
    } catch (err) {
      console.log("Error loading comments:", err);
    }
  };

  const submitComment = async () => {
    if (!commentText.trim()) return;

    try {
      await axios.post(
        "http://localhost:5000/api/comments/${foodId}",
        {
          foodId: commentBox,
          text: commentText,
        },
        { withCredentials: true }
      );

      setAllComments((prev) => ({
        ...prev,
        [commentBox]: [
          ...(prev[commentBox] || []),
          { text: commentText, createdAt: new Date() },
        ],
      }));

      setCommentText("");
    } catch (err) {
      console.log("Comment error:", err);
    }
  };

  return (
    <>
      <div ref={containerRef} className="reel-page">
        <div className="reels-feed" role="list">
          {videos.map((item) => (
            <section key={item._id} className="reel" role="listitem">
              <video
                ref={setVideoRef(item._id)}
                className="reel-video"
                src={item.video}
                muted
                playsInline
                loop
                preload="metadata"
                autoPlay
              />

              <div className="reel-overlay">
                <div className="right-buttons">
                  <div className="action-group">
                    <button
                      className="icon-btn"
                      onClick={() => likeVideo(item)}
                    >
                      {likes[item._id] ? (
                        <AiFillHeart size={28} color="red" />
                      ) : (
                        <AiOutlineHeart size={28} color="white" />
                      )}
                    </button>
                    <span className="count">{item.likeCount || 0}</span>
                  </div>

                  <div className="action-group">
                    <button
                      className="icon-btn"
                      onClick={() => saveVideo(item)}
                    >
                      {saved[item._id] ? (
                        <BsBookmarkFill size={25} color="white" />
                      ) : (
                        <BsBookmark size={25} color="white" />
                      )}
                    </button>
                    <span className="count">{item.savesCount || 0}</span>
                  </div>

                  <div className="action-group">
                    <button
                      className="icon-btn"
                      onClick={() => openCommentBox(item._id)}
                    >
                      <FaRegComment size={25} color="white" />
                    </button>
                    <span className="count">{item.commentCount || 0}</span>
                  </div>
                </div>

                <div className="reel-content">
                  <p className="reel-description">{item.description}</p>
                  <Link
                    className="reel-btn"
                    to={"/food-partner/" + item.foodPartner}
                  >
                    Visit Store
                  </Link>
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="bottom-nav">
          <Link to="/" className="nav-btn">
            <AiOutlineHome size={25} />
          </Link>
          <Link to="/" className="nav-btn">
            <BsBookmark size={20} />
          </Link>
        </div>
      </div>

      {commentBox && (
        <div className="comment-popup">
          <div className="comment-header">
            <span>Comments</span>
            <span
              style={{ fontSize: "20px", cursor: "pointer" }}
              onClick={() => setCommentBox(null)}
            >
              ✖
            </span>
          </div>

          <div className="comment-list">
            {(allComments[commentBox] || []).map((c, index) => (
              <div className="comment-item" key={index}>
                <span className="comment-user">User</span>
                <div className="comment-text">{c.text}</div>
              </div>
            ))}
          </div>

          <div className="comment-input-box">
            <textarea
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button onClick={submitComment}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
