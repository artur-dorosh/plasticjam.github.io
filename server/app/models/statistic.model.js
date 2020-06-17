module.exports = mongoose => {
  const Statistic = mongoose.model(
    "statistic",
    mongoose.Schema(
      {
        page_views: Number,
        date: Date,
        clicks: Number,
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
      },
      { timestamps: true }
    )
  );

  return Statistic;
};
