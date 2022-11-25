// class ApiFeatures {
//   constructor(query, queryStr) {
//     this.query = query;
//     this.queryStr = queryStr;
//   }

//   search() {
//     const keyword = this.queryStr.keyword
//       ? {
//         name: {
//           $regex: this.queryStr.keyword,
//           $options: "i",
//         },
//       }
//       : {};

//     this.query = this.query.find({ ...keyword });
//     return this;
//   }

//   filter() {
//     const queryCopy = { ...this.queryStr };
//     //   Removing some fields for category
//     const removeFields = ["keyword", "page", "limit"];

//     removeFields.forEach((key) => delete queryCopy[key]);


//     // this.query = this.query.find(queryCopy); // [[line-30]] this line of code is for strict value filtering but considering rangeable filter like filtering for price range or rating range this line will fail soo need ot comment out and work as bellow


//     // Filter For Price and Rating
//     let queryStr = JSON.stringify(queryCopy);
//     queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

//     this.query = this.query.find(JSON.parse(queryStr));

//     return this;
//   }

//   /* pagination(resultPerPage) {
//     const currentPage = Number(this.queryStr.page) || 1;
 
//     const skip = resultPerPage * (currentPage - 1);
 
//     this.query = this.query.limit(resultPerPage).skip(skip);
 
//     return this;
//   } */
//   pagination(limit) {
//     const page = Number(this.queryStr.page);

//     if (limit || page) {
//       const skip = limit * page;
//       this.query = this.query.limit(limit).skip(skip);
//     }

//     return this;
//   }

// }

// module.exports = ApiFeatures;











class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
        name: {
          $regex: this.queryStr.keyword,
          $options: "i",
        },
      }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    //   Removing some fields for category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);


    // this.query = this.query.find(queryCopy); // [[line-30]] this line of code is for strict value filtering but considering rangeable filter like filtering for price range or rating range this line will fail soo need ot comment out and work as bellow


    // Filter For Price and Rating
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  /* pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
 
    const skip = resultPerPage * (currentPage - 1);
 
    this.query = this.query.limit(resultPerPage).skip(skip);
 
    return this;
  } */
  pagination(limit) {
    const page = Number(this.queryStr.page);

    if (limit || page) {
      const skip = limit * page;
      this.query = this.query.limit(limit).skip(skip);
    }

    return this;
  }

}

module.exports = ApiFeatures;