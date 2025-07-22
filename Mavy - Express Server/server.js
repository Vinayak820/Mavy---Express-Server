// const express = require("express");
// const cors = require("cors");
// const { Server } = require('socket.io');
// const fs = require("fs");
// const http = require("http");
// const dotenv = require("dotenv");
// const { Readable } = require("stream");
// const axios = require("axios");
// const cloudinary = require("cloudinary").v2;
// const path = require("path");

// const app = express();
// app.use(cors())
// dotenv.config();
// const server = http.createServer(app);




// // // Set axios default headers
// // axios.defaults.headers.common["origin"] = 'https://opal-express-gc8f.onrender.com';
// // axios.defaults.headers.common["Content-Type"] = "application/json";

// // Cloudinary configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Socket.IO configuration with better error handling
// const io = new Server(server, {
//   cors: {
//       origin: '*',
//       methods: ["GET", "POST"],
//   },
// })
// // Ensure temp_upload directory exists
// const uploadDir = path.join(__dirname, 'temp_upload');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Store chunks per socket connection
// const socketChunks = new Map();

// io.on("connection", (socket) => {
//   console.log("🟢 Socket connected:", socket.id);
//   socketChunks.set(socket.id, []);

//   socket.emit("connected");

//   socket.on("video-chunks", async (data) => {
//     try {
//       console.log("🟢 Receiving video chunk for:", data.filename);

//       const chunks = socketChunks.get(socket.id);
//       chunks.push(data.chunks);

//       const filePath = path.join(uploadDir, data.filename);
//       const writeStream = fs.createWriteStream(filePath);

//       const videoBlob = new Blob(chunks, {
//         type: "video/webm; codecs=vp9",
//       });

//       const buffer = Buffer.from(await videoBlob.arrayBuffer());
//       const readStream = Readable.from(buffer);

//       readStream.pipe(writeStream);

//       writeStream.on("finish", () => {
//         console.log("🟢 Chunk saved for:", data.filename);
//       });

//       writeStream.on("error", (error) => {
//         console.error("🔴 Error saving chunk:", error);
//         socket.emit("upload-error", { message: "Failed to save video chunk" });
//       });
//     } catch (error) {
//       console.error("🔴 Error processing video chunk:", error);
//       socket.emit("upload-error", { message: "Failed to process video chunk" });
//     }
//   });

//   socket.on("process-video", async (data) => {
//     try {
//       console.log("🟢 Processing video:", data.filename);
//       socketChunks.set(socket.id, []); // Clear chunks

//       const filePath = path.join(uploadDir, data.filename);

//       // Verify file exists
//       if (!fs.existsSync(filePath)) {
//         throw new Error("Video file not found");
//       }

//       // Start processing
//       const processing = await axios.post(
//         `${process.env.NEXT_API_HOST}recording/${data.userId}/processing`,
//         { filename: data.filename }
//       );

//       if (processing.data.status !== 200) {
//         throw new Error("Failed to create processing file");
//       }

//       // Upload to Cloudinary
//       const cloudinaryUpload = cloudinary.uploader.upload_stream(
//         {
//           resource_type: "video",
//           folder: "opal",
//           public_id: data.filename,
//         },
//         async (error, result) => {
//           try {
//             if (error) {
//               throw error;
//             }

//             console.log("🟢 Video uploaded to Cloudinary:", result.secure_url);

//             // Complete processing
//             const stopProcessing = await axios.post(
//               `${process.env.NEXT_API_HOST}recording/${data.userId}/complete`,
//               { filename: data.filename }
//             );

//             if (stopProcessing.data.status !== 200) {
//               throw new Error("Failed to complete processing");
//             }

//             // Clean up
//             fs.unlink(filePath, (err) => {
//               if (err) {
//                 console.error("🔴 Error deleting file:", err);
//               } else {
//                 console.log("🟢 Deleted file:", data.filename);
//               }
//             });

//           } catch (error) {
//             console.error("🔴 Error in Cloudinary upload callback:", error);
//           }
//         }
//       );

//       fs.createReadStream(filePath).pipe(cloudinaryUpload);

//     } catch (error) {
//       console.error("🔴 Error processing video:", error);
//     }
//   });


//   socket.on("disconnect", () => {
//     console.log("🔴 Socket disconnected:", socket.id);
//     socketChunks.delete(socket.id); // Clean up chunks
//   });
// });

// // Error handling for unhandled rejections
// process.on('unhandledRejection', (error) => {
//   console.error('🔴 Unhandled Rejection:', error);
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, async () => {
//   console.log(`🟢 Server listening on port ${PORT}`);
// });



//------------------------------

// const express = require("express");
// const cors = require("cors");
// const { Server } = require("socket.io");
// const fs = require("fs");
// const http = require("http");
// const dotenv = require("dotenv");
// const { Readable } = require("stream");
// const axios = require("axios");
// const cloudinary = require("cloudinary").v2;
// const path = require("path");

// const app = express();
// app.use(cors());
// dotenv.config();
// const server = http.createServer(app);

// // Cloudinary configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Socket.IO configuration
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// // Ensure temp_upload directory exists
// const uploadDir = path.join(__dirname, "temp_upload");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Store chunks per socket connection
// const socketChunks = new Map();



// io.on("connection", (socket) => {
//   console.log("🟢 Socket connected:", socket.id);
//   socketChunks.set(socket.id, []);
//   socket.emit("connected");

//   socket.on("video-chunks", async (data) => {
//     try {
//       console.log("🟢 Receiving video chunk for:", data.filename);

//       const chunks = socketChunks.get(socket.id);
//       chunks.push(data.chunks); // Ensure frontend sends raw buffers

//       const buffer = Buffer.concat(chunks.map(chunk => Buffer.from(chunk)));
//       const filePath = path.join(uploadDir, data.filename);
//       const writeStream = fs.createWriteStream(filePath);

//       const readStream = Readable.from(buffer);
//       readStream.pipe(writeStream);

//       readStream.on("error", (err) => {
//         console.error("🔴 Error reading buffer stream:", err);
//         socket.emit("upload-error", { message: "Error reading video buffer" });
//       });

//       writeStream.on("finish", () => {
//         console.log("🟢 Chunk saved for:", data.filename);
//       });

//       writeStream.on("error", (error) => {
//         console.error("🔴 Error saving chunk:", error);
//         socket.emit("upload-error", { message: "Failed to save video chunk" });
//       });

//     } catch (error) {
//       console.error("🔴 Error processing video chunk:", error);
//       socket.emit("upload-error", { message: "Failed to process video chunk" });
//     }
//   });

//   socket.on("process-video", async (data) => {
//     try {
//       console.log("🟢 Processing video:", data.filename);
//       socketChunks.set(socket.id, []); // Clear stored chunks

//       const filePath = path.join(uploadDir, data.filename);
//       if (!fs.existsSync(filePath)) {
//         throw new Error("Video file not found");
//       }

//       // Start processing in backend
//       const processing = await axios.post(
//         `${process.env.NEXT_API_HOST}recording/${data.userId}/processing`,
//         { filename: data.filename }
//       );

//       if (processing.data.status !== 200) {
//         throw new Error("Failed to create processing file");
//       }

//       // Upload to Cloudinary
//       const cloudinaryUpload = cloudinary.uploader.upload_stream(
//         {
//           resource_type: "video",
//           folder: "opal",
//           public_id: data.filename,
//         },
//         async (error, result) => {
//           try {
//             if (error) throw error;

//             console.log("🟢 Video uploaded to Cloudinary:", result.secure_url);

//             // Notify backend of completion
//             const stopProcessing = await axios.post(
//               `${process.env.NEXT_API_HOST}recording/${data.userId}/complete`,
//               { filename: data.filename }
//             );

//             if (stopProcessing.data.status !== 200) {
//               throw new Error("Failed to complete processing");
//             }

//             // Delete local file
//             fs.unlink(filePath, (err) => {
//               if (err) {
//                 console.error("🔴 Error deleting file:", err);
//               } else {
//                 console.log("🟢 Deleted file:", data.filename);
//               }
//             });

//           } catch (error) {
//             console.error("🔴 Error in Cloudinary upload callback:", error);
//           }
//         }
//       );

//       fs.createReadStream(filePath).pipe(cloudinaryUpload);

//     } catch (error) {
//       console.error("🔴 Error processing video:", error);
//       socket.emit("upload-error", { message: "Video processing failed" });
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("🔴 Socket disconnected:", socket.id);
//     socketChunks.delete(socket.id);
//   });
// });

// // Handle unhandled promise rejections
// process.on("unhandledRejection", (error) => {
//   console.error("🔴 Unhandled Rejection:", error);
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`🟢 Server listening on port ${PORT}`);
// });



//--------------

// const express = require("express");
// const app = express();
// const { Server } = require("socket.io");
// const fs = require("fs");
// const cors = require("cors");
// const http = require("http");
// const { Readable } = require("stream");
// const axios = require("axios");
// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
// const { OpenAI } = require("openai");
// const dotenv = require("dotenv");
// dotenv.config();


// const openai = new OpenAI({
//   apiKey: process.env.OPEN_AI_KEY,
// })

// const s3 = new S3Client({
//   credentials: {
//     accessKeyId: process.env.ACCESS_KEY,
//     secretAccessKey: process.env.SECRET_KEY,
//   },
//   region: process.env.BUCKET_REGION,
// })

// const server = http.createServer(app);
// console.log(process.env.ELECTRON_HOST);

// app.use(cors());

// const io = new Server(server, {
//   cors: {
//     origin: process.env.ELECTRON_HOST,
//     methods: ["GET", "POST"]
//   }
// });

// let recordedChunks = []

// io.on("connection", (socket) => {
//   console.log("Socket is connected");
//   socket.on("video-chunks", async (data) => {
//     console.log("Video chunks is sent");

//     const writestream = fs.createWriteStream("temp_upload/" + data.filename)
//     recordedChunks.push(data.chunks)
//     const videoBlob = new Blob(recordedChunks, {
//       type: "video/webm; codecs=vp9",
//     })
//     const buffer = Buffer.from(await videoBlob.arrayBuffer())
//     const readStream = Readable.from(buffer)
//     readStream.pipe(writestream).on("finish", () => {
//       console.log("Chunk saved")
//     })
//   });
//   socket.on("process-video", async (data) => {
//     console.log("Processing video...");
//     recordedChunks = []
//     fs.readFile("temp_upload/" + data.filename, async (err, file) => {
//       const processing = await axios.post(
//         `${process.env.NEXT_API_HOST}recording/${data.userId}/processing`,
//         {
//           filename: data.filename,
//         }
//       )
//       if (processing.status !== 200) {
//         return console.log(
//           "Error: Something went wrong with creating the processing file"
//         );
//       }
//       const key = data.filename
//       const Bucket = process.env.BUCKET_NAME
//       const ContentType = "video/webm"
//       const command = new PutObjectCommand({
//         Key,
//         Bucket,
//         ContentType,
//         Body: file,
//       })

//       const fileStatus = await s3.send(command)

//       if (fileStatus['$metadatd'].httpStatusCode === 200) {
//         console.log("Video uploaded to AWS");

//         if (processing.data.plan === "PRO") {
//           fs.stat("temp_upload/" + data.filename, async (err, stat) => {
//             if (!err) {
//               //wiser 25md
//               if (stat.size < 25000000) {
//                 const transcript = await openai.audio.transcriptions.create({
//                   file: fs.createReadStream(`temp_upload/${data.filename}`),
//                   model: "whisper-1",
//                   response_format: "text",
//                 })

//                 if (transcription) {
//                   const completion = await openai.chat.completions.create({
//                     model: "gpt-3.5-turbo",
//                     response_format: { type: "json_object" },
//                     messages: [
//                       {
//                         role: "system",
//                         content: `You are going to generate a title and a nice description using the speech to text transcription provided: transcription
//                                             (${transcription}) and then return it in json format {"tittle}: <the tittle you gave>, "summary": <the summary you created>`
//                       },
//                     ]
//                   })
//                   const titleAndSummaryGenerated = await axios.post(
//                     `${process.env.NEXT_API_HOST}recording/${data.userId}/transcribe`,
//                     {
//                       filename: data.filename,
//                       content: completion.choices[0].message.content,
//                       transcript: transcription,
//                     }
//                   )
//                   if (titleAndSummaryGenerated.status !== 200)
//                     return console.log("Error: Something went wrong with generating the title and description");
//                 }
//               }
//             }
//           })
//         }
//         const stopProcessing = await axios.post(
//           `${process.env.NEXT_API_HOST}recording/${data.userId}/complete`,
//           {
//             filename: data.filename,

//           }
//         )
//         if (stopProcessing.status !== 200) {
//           console.log(
//             "Error: Something went wrong with stopping the process and trying to complete the processing stage."
//           );
//         }
//         if (stopProcessing.status === 200) {
//           fs.unlink("temp_upload/" + data.filename, (err) => {
//             if (!err) {
//               console.log(data.filename + " " + " deleted successfully");
//             }
//           })
//         }
//       }
//       else {
//         console.log("Error: Upload Fails! process aborted");
//       }
//     });
//   });
//   socket.on("disconnect", async (data) => {
//     console.log("Socket is disconnected", socket.id);
//   });
// });

// server.listen(5001, () => {
//   console.log("Listening to port 5001");
// });





//---------------------------------


// const express = require("express");
// const app = express();
// const { Server } = require("socket.io");
// const fs = require("fs");
// const cors = require("cors");
// const http = require("http");
// const { Readable } = require("stream");
// const axios = require("axios");
// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
// const { OpenAI } = require("openai");
// const dotenv = require("dotenv");
// dotenv.config();

// const openai = new OpenAI({
//   apiKey: process.env.OPEN_AI_KEY,
// });

// const s3 = new S3Client({
//   credentials: {
//     accessKeyId: process.env.ACCESS_KEY,
//     secretAccessKey: process.env.SECRET_KEY,
//   },
//   region: process.env.BUCKET_REGION || "us-east-1", // fallback if not defined
// });

// const server = http.createServer(app);
// console.log(process.env.ELECTRON_HOST);

// app.use(cors());

// const io = new Server(server, {
//   cors: {
//     origin: process.env.ELECTRON_HOST,
//     methods: ["GET", "POST"],
//   },
// });

// let recordedChunks = [];

// io.on("connection", (socket) => {
//   console.log("Socket is connected");

//   socket.on("video-chunks", async (data) => {
//     console.log("Video chunks is sent");

//     const writestream = fs.createWriteStream("temp_upload/" + data.filename);
//     recordedChunks.push(data.chunks);
//     const videoBlob = new Blob(recordedChunks, {
//       type: "video/webm; codecs=vp9",
//     });
//     const buffer = Buffer.from(await videoBlob.arrayBuffer());
//     const readStream = Readable.from(buffer);
//     readStream.pipe(writestream).on("finish", () => {
//       console.log("Chunk saved");
//     });
//   });

//   socket.on("process-video", async (data) => {
//     console.log("Processing video...");
//     recordedChunks = [];
//     fs.readFile("temp_upload/" + data.filename, async (err, file) => {
//       const processing = await axios.post(
//         `${process.env.NEXT_API_HOST}recording/${data.userId}/processing`,
//         {
//           filename: data.filename,
//         }
//       );

//       if (processing.status !== 200) {
//         return console.log(
//           "Error: Something went wrong with creating the processing file"
//         );
//       }

//       const key = data.filename;
//       const Bucket = process.env.BUCKET_NAME;
//       const ContentType = "video/webm";
//       const command = new PutObjectCommand({
//         Key: key,
//         Bucket,
//         ContentType,
//         Body: file,
//       });

//       const fileStatus = await s3.send(command);

//       if (fileStatus["$metadata"].httpStatusCode === 200) {
//         console.log("Video uploaded to AWS");

//         if (processing.data.plan === "PRO") {
//           fs.stat("temp_upload/" + data.filename, async (err, stat) => {
//             if (!err) {
//               if (stat.size < 25000000) {
//                 const transcript = await openai.audio.transcriptions.create({
//                   file: fs.createReadStream(`temp_upload/${data.filename}`),
//                   model: "whisper-1",
//                   response_format: "text",
//                 });

//                 if (transcript) {
//                   const completion = await openai.chat.completions.create({
//                     model: "gpt-3.5-turbo",
//                     response_format: { type: "json_object" },
//                     messages: [
//                       {
//                         role: "system",
//                         content: `You are going to generate a title and a nice description using the speech to text transcription provided: transcription
//                                             (${transcript}) and then return it in json format {"tittle}: <the tittle you gave>, "summary": <the summary you created>`,
//                       },
//                     ],
//                   });

//                   const titleAndSummaryGenerated = await axios.post(
//                     `${process.env.NEXT_API_HOST}recording/${data.userId}/transcribe`,
//                     {
//                       filename: data.filename,
//                       content: completion.choices[0].message.content,
//                       transcript: transcript,
//                     }
//                   );

//                   if (titleAndSummaryGenerated.status !== 200)
//                     return console.log(
//                       "Error: Something went wrong with generating the title and description"
//                     );
//                 }
//               }
//             }
//           });
//         }

//         const stopProcessing = await axios.post(
//           `${process.env.NEXT_API_HOST}recording/${data.userId}/complete`,
//           {
//             filename: data.filename,
//           }
//         );

//         if (stopProcessing.status !== 200) {
//           console.log(
//             "Error: Something went wrong with stopping the process and trying to complete the processing stage."
//           );
//         }

//         if (stopProcessing.status === 200) {
//           fs.unlink("temp_upload/" + data.filename, (err) => {
//             if (!err) {
//               console.log(data.filename + " " + " deleted successfully");
//             }
//           });
//         }
//       } else {
//         console.log("Error: Upload Fails! process aborted");
//       }
//     });
//   });

//   socket.on("disconnect", async (data) => {
//     console.log("Socket is disconnected", socket.id);
//   });
// });

// server.listen(5001, () => {
//   console.log("Listening to port 5001");
// });




//------------
// Without Open Ai

const express = require("express");
const app = express();
const { Server } = require("socket.io");
const fs = require("fs");
const cors = require("cors");
const http = require("http");
const { Readable } = require("stream");
const axios = require("axios");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
dotenv.config();

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
  region: process.env.BUCKET_REGION,
});

const server = http.createServer(app);
console.log(process.env.ELECTRON_HOST);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: process.env.ELECTRON_HOST,
    methods: ["GET", "POST"],
  },
});

let recordedChunks = [];

io.on("connection", (socket) => {
  console.log("Socket is connected");

  socket.on("video-chunks", async (data) => {
    console.log("Video chunks is sent");

    const writestream = fs.createWriteStream("temp_upload/" + data.filename);
    recordedChunks.push(data.chunks);
    const videoBlob = new Blob(recordedChunks, {
      type: "video/webm; codecs=vp9",
    });
    const buffer = Buffer.from(await videoBlob.arrayBuffer());
    const readStream = Readable.from(buffer);
    readStream.pipe(writestream).on("finish", () => {
      console.log("Chunk saved");
    });
  });

  socket.on("process-video", async (data) => {
    console.log("Processing video...");
    recordedChunks = [];
    fs.readFile("temp_upload/" + data.filename, async (err, file) => {
      if (err) {
        console.log("Error reading file:", err);
        return;
      }

      const processing = await axios.post(
        `${process.env.NEXT_API_HOST}recording/${data.userId}/processing`,
        { filename: data.filename }
      );

      if (processing.status !== 200) {
        return console.log(
          "Error: Something went wrong with creating the processing file"
        );
      }

      const Key = data.filename;
      const Bucket = process.env.BUCKET_NAME;
      const ContentType = "video/webm";

      if (!Bucket) {
        throw new Error("S3 Bucket name is not defined in environment variables.");
      }

      const command = new PutObjectCommand({
        Key,
        Bucket,
        ContentType,
        Body: file,
      });

      const fileStatus = await s3.send(command);

      if (fileStatus["$metadata"].httpStatusCode === 200) {
        console.log("Video uploaded to AWS");

        // Further logic for processing can be added here

        const stopProcessing = await axios.post(
          `${process.env.NEXT_API_HOST}recording/${data.userId}/complete`,
          { filename: data.filename }
        );

        if (stopProcessing.status !== 200) {
          console.log("Error: Failed to complete processing.");
        }

        if (stopProcessing.status === 200) {
          fs.unlink("temp_upload/" + data.filename, (err) => {
            if (!err) {
              console.log(data.filename + " deleted successfully");
            }
          });
        }
      } else {
        console.log("Error: Upload failed! Process aborted.");
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("Socket is disconnected", socket.id);
  });
});

server.listen(5001, () => {
  console.log("Listening to port 5001");
});
