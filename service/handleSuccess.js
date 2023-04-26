const handleSuccess = (res, data) => {
  res.send({ status: "true", message: data }).end();
};

module.exports = handleSuccess;
