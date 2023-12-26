const {
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const { storage } = require("../firebase");
const { Query } = require("../models/QueryPosting");

const postQuestion = async (req, res) => {
  const { id, name, catagory, questionText, questionJSX } = req.body;

  try {
    let files;
    if (req.files) {
      files = req.files.files;
    }
    // console.log(req.files.files);
    let queryPoster = {
      id,
      name,
    };

    let filesUpload = [];

    const filesArray = Array.isArray(files) ? files : [files];

    // Using Promise.all to wait for all uploads to complete
    await Promise.all(
      filesArray.map(async (file) => {
        let metadata = {
          contentType: file.mimetype,
        };
        const storageRef = ref(storage, "queryFiles/" + Date.now() + file.name);
        const uploadTask = uploadBytesResumable(
          storageRef,
          file.data,
          metadata
        );

        // Wrap the event listener in a Promise to await completion
        await new Promise((resolve, reject) => {
          uploadTask.on("state_changed", null, reject, async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              filesUpload.push({
                fileName: file.name,
                pathName: downloadURL,
              });
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        });
      })
    );

    const newQuery = new Query({
      queryPoster,
      questionText,
      questionJSX,
      filesUpload,
      catagory,
    });

    const savedQuery = await newQuery.save();
    res.status(200).json({
      Success: true,
      Message: "Query posted successfully",
      Query: savedQuery,
    });
  } catch (err) {
    // console.error("Error uploading files:", err);
    res.status(500).json({ Success: false, Message: "Internal Server Error" });
  }
};

const updateQuery = async (req, res) => {
  let { id, ...rest } = req.body;

  let files;
  if (req.files) {
    files = req.files.files;
  }

  let filesUpload = [];

  try {
    // Upload new files if provided
    if (files) {
      const filesArray = Array.isArray(files) ? files : [files];

      // Using Promise.all to wait for all uploads to complete
      await Promise.all(
        filesArray.map(async (file) => {
          let metadata = {
            contentType: file.mimetype,
          };
          const storageRef = ref(
            storage,
            "queryFiles/" + Date.now() + file.name
          );
          const uploadTask = uploadBytesResumable(
            storageRef,
            file.data,
            metadata
          );

          // Wrap the event listener in a Promise to await completion
          await new Promise((resolve, reject) => {
            uploadTask.on("state_changed", null, reject, async () => {
              try {
                const downloadURL = await getDownloadURL(
                  uploadTask.snapshot.ref
                );
                filesUpload.push({
                  fileName: file.name,
                  pathName: downloadURL,
                });
                resolve();
              } catch (error) {
                reject(error);
              }
            });
          });
        })
      );
    }

    // Update the rest of the fields and filesUpload
    const updatedQuery = await Query.findByIdAndUpdate(
      id,
      {
        ...rest,
        $addToSet: { filesUpload: { $each: filesUpload } },
      },
      { new: true }
    );

    if (!updatedQuery) {
      return res
        .status(404)
        .send({ Success: false, Message: "Query not found" });
    }

    res.status(200).send({
      Success: true,
      Message: "Query Updated",
      Query: updatedQuery._doc,
    });
  } catch (error) {
    res
      .status(500)
      .send({ Success: false, Message: "Error updating query", Error: error });
  }
};

const deleteQuery = async (req, res) => {
  let toFind = req.params.id;
  try {
    let deletedQuery = await Query.findByIdAndDelete(toFind);
    res.status(200).send({
      Success: true,
      Message: "Query deleted successfully",
      DeletedQery: deletedQuery._doc,
    });
  } catch (error) {
    res.status(404).send({ Success: false, Message: "Query not found" });
  }
};

// get query by id
const getQuery = async (req, res) => {
  let toFind = req.params.id;
  try {
    let foundQuery = await Query.findOne({ _id: toFind });
    res.status(200).send({ Success: true, Query: foundQuery._doc });
  } catch (error) {
    res.status(404).send({ Success: false, Message: "Query not found" });
  }
};

// for discussion
const addComment = async (req, res) => {
  let { queryId, flag, comment } = req.body;
  try {
    const foundQuery = await Query.findByIdAndUpdate(
      queryId,
      { $push: { comments: { flag, comment } } },
      { new: true }
    );

    res.status(200).send({
      Success: true,
      Message: "Comment added",
      Comment: comment,
    });
  } catch (error) {
    res.status(404).send({ Success: false, Message: "Error adding comment" });
  }
};

const addFeedback = async (req, res) => {
  // answer is removed if feedback stars are less than 3
  let { queryId, stars } = req.body;

  try {
    const updatedQuery = await Query.findByIdAndUpdate(
      queryId,
      { answerFeedback: stars },
      { new: true }
    );

    if (!updatedQuery) {
      return res
        .status(404)
        .send({ Success: false, Message: "Query not found" });
    }

    if (stars < 3) {
      // If stars are less than 3, remove answerText, answerJSX, set taken to false, and remove takenBy
      updatedQuery.answerText = "";
      updatedQuery.answerJSX = "";
      updatedQuery.isTaken = {
        taken: false,
        takenBy: {
          id: "",
          name: "",
        },
      };
    }

    res.status(200).send({
      Success: true,
      Message: "Feedback added",
      Feedback: updatedQuery.answerFeedback,
    });
  } catch (error) {
    res.status(500).send({ Success: false, Message: "Error adding Feedback" });
  }
};

const selectQuery = async (req, res) => {
  let { id, takenByExpert } = req.body; // takenBy is a object

  try {
    const updatedQuery = await Query.findByIdAndUpdate(
      id,
      {
        isTaken: {
          taken: true,
          takenBy: {
            id: takenByExpert.id,
            name: takenByExpert.name,
          },
        },
      },
      { new: true }
    );

    if (!updatedQuery) {
      return res
        .status(404)
        .send({ Success: false, Message: "Query not found" });
    }

    res.status(200).send({
      Success: true,
      Message: "Query selected successfully",
      Query: updatedQuery._doc,
    });
  } catch (error) {
    res
      .status(500)
      .send({ Success: false, Message: "Error selecting query", Error: error });
  }
};
const answerQuery = async (req, res) => {
  let { id, answeredBy, answerText, answerJSX } = req.body;
  const files = req.files.files;

  let filesUpload = [];

  const filesArray = Array.isArray(files) ? files : [files];

  // Using Promise.all to wait for all uploads to complete
  await Promise.all(
    filesArray.map(async (file) => {
      let metadata = {
        contentType: file.mimetype,
      };
      const storageRef = ref(storage, "queryFiles/" + Date.now() + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file.data, metadata);

      // Wrap the event listener in a Promise to await completion
      await new Promise((resolve, reject) => {
        uploadTask.on("state_changed", null, reject, async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            filesUpload.push({
              fileName: file.name,
              pathName: downloadURL,
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });
    })
  );

  try {
    const answeredQuery = await Query.findByIdAndUpdate(
      id,
      {
        answerText: answerText,
        answerJSX: answerJSX,
        answerFiles: filesUpload,
        querySolver: {
          id: answeredBy.id,
          name: answeredBy.name,
        },
      },
      { new: true }
    );

    if (!answeredQuery) {
      return res
        .status(404)
        .send({ Success: false, Message: "Query not found" });
    }

    res.status(200).send({
      Success: true,
      Message: "Answer saved successfully",
      Query: answeredQuery._doc,
    });
  } catch (error) {
    res
      .status(500)
      .send({ Success: false, Message: "Error saving answer", Error: error });
  }
};

const updateAnswer = async (req, res) => {
  let { id, updatedAnswerText, updatedAnswerJSX } = req.body;
  let files;
  if (req.files) {
    files = req.files.files;
  }

  let filesUpload = [];

  try {
    // Upload new files if provided
    if (files) {
      const filesArray = Array.isArray(files) ? files : [files];

      // Using Promise.all to wait for all uploads to complete
      await Promise.all(
        filesArray.map(async (file) => {
          let metadata = {
            contentType: file.mimetype,
          };
          const storageRef = ref(
            storage,
            "queryFiles/" + Date.now() + file.name
          );
          const uploadTask = uploadBytesResumable(
            storageRef,
            file.data,
            metadata
          );

          // Wrap the event listener in a Promise to await completion
          await new Promise((resolve, reject) => {
            uploadTask.on("state_changed", null, reject, async () => {
              try {
                const downloadURL = await getDownloadURL(
                  uploadTask.snapshot.ref
                );
                filesUpload.push({
                  fileName: file.name,
                  pathName: downloadURL,
                });
                resolve();
              } catch (error) {
                reject(error);
              }
            });
          });
        })
      );
    }

    // Update answerText, answerJSX, and answerFiles
    const updatedQuery = await Query.findByIdAndUpdate(
      id,
      {
        answerText: updatedAnswerText,
        answerJSX: updatedAnswerJSX,
        $addToSet: { answerFiles: { $each: filesUpload } },
      },
      { new: true }
    );

    if (!updatedQuery) {
      return res
        .status(404)
        .send({ Success: false, Message: "Query not found" });
    }

    res.status(200).send({
      Success: true,
      Message: "Answer updated successfully",
      Query: updatedQuery._doc,
    });
  } catch (error) {
    res
      .status(500)
      .send({ Success: false, Message: "Error updating answer", Error: error });
  }
};

module.exports = {
  postQuestion,
  updateQuery,
  deleteQuery,
  getQuery,
  addComment,
  addFeedback,
  selectQuery,
  answerQuery,
  updateAnswer,
};
