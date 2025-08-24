// CommentSection.js

import axios from 'axios';
import React, { useState } from 'react';

const CommentSection = ({ comments, eventId, userId, depth }) => {
    const [openReplyForms, setOpenReplyForms] = useState([]);
    const [replyToId, setReplyToId] = useState('');
    const [error, setError] = useState('')
    const [commentText, setCommentText] = useState({
        textAreaValue: '',
      });

      const toggleReplyForm = (commentId) => {
        console.log({commentId});
        setReplyToId(commentId)
        setOpenReplyForms((prevForms) => {
          if (prevForms.includes(commentId)) {
            return prevForms.filter((id) => id !== commentId);
          } else {
            return [...prevForms, commentId];
          }
        });
      };

      async function handleCommentSubmit(e){
        e.preventDefault();
        const {textAreaValue} = commentText;
        console.log("there")
    
        if (!textAreaValue.trim()) {
            setError('Please enter a comment.'); // Set an error message if textarea is empty
            return;
          }
    
        const pushCommentEndpoint = `https://zty8kz1jvl.execute-api.us-east-2.amazonaws.com/api/v1/comment`;
            const requestData = {
                requestId: String(Date.now()),
                eventId: eventId,
                userId: userId,
                comment: textAreaValue,
                replyToId: replyToId
                };
            
            console.log(requestData)
            
            const res = await axios.post(pushCommentEndpoint, requestData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
    
            setCommentText({ textAreaValue: '' });
            toggleReplyForm('')
            if (res.status === 200 && !res.data.statusCode) {
                window.location.reload();
                return;
            }
      }

    const handleTextAreaChange = (e) => {
    setCommentText({
        textAreaValue: e.target.value,
    });
    };

    const getDateString = (dateTimeString) => {
        return new Intl.DateTimeFormat("en-US", {
            timeZone: "America/New_York",
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(new Date(dateTimeString));
    }

    const getEstTimeString = (dateTimeString) => {
        return new Intl.DateTimeFormat("en-US", {
            timeZone: "America/New_York",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        }).format(new Date(dateTimeString));
    }

    return (
    <div>
      {comments.map((comment) => (
        <div key={comment._id} className="p-6 text-base bg-white rounded-lg">
          <footer className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <p className="inline-flex items-center mr-3 text-sm text-gray-900 font-semibold">
                <img className="mr-2 w-6 h-6 rounded-full" src={`data:image/jpeg;base64,${comment.author.id.userPic}`} alt="User" />
                {`${comment.author.id.firstName} ${comment.author.id.lastName}`}
              </p>
              <p className="text-sm text-gray-600">
                <time pubdate datetime={getDateString(comment.createdAt)} title={getDateString(comment.createdAt)}>
                  {getEstTimeString(comment.createdAt)} EST, {getDateString(comment.createdAt)}
                </time>
              </p>
            </div>
          </footer>
          <p className="text-gray-500">{comment.text}</p>
          {openReplyForms.includes(comment._id) ? (<form className="my-6">
            <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200">
              <label htmlFor="comment" className="sr-only">Your comment</label>
              <textarea
                id="comment"
                rows="6"
                onChange={handleTextAreaChange}
                value={commentText.textAreaValue}
                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none placeholder-gray-400"
                placeholder="Write a comment..."
                required
              ></textarea>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex space-x-4">
              <button
                type="submit"
                onClick={handleCommentSubmit}
                className="inline-flex items-center py-2.5 px-4 bg-indigo-600 text-xs font-semibold text-center text-white bg-primary-700 rounded-md focus:ring-4 focus:ring-primary-200 hover:bg-primary-800"
              >
                Post comment
              </button>
              <button
                type="button"
                onClick={() => toggleReplyForm(comment._id)}
                className="inline-flex items-center py-2.5 px-4 text-xs font-semibold text-center text-gray-700 bg-gray-200 rounded-md focus:ring-4 focus:ring-gray-300 hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </form>)
          : ( depth < 1 &&
          <div class="flex items-center mt-4 space-x-4">
            <button type="button"
                onClick={() => toggleReplyForm(comment._id)}
                class="flex items-center text-sm text-gray-500 hover:underline font-medium">
                <svg class="mr-1.5 w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"/>
                </svg>
                Reply
            </button>
        </div>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <div className="nested-comments">
              <CommentSection comments={comment.replies} eventId={eventId} userId={userId} depth={depth+1} />
            </div>
          )}
          {/* Add your reply form logic here */}
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
