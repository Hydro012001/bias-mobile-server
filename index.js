const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();
const bcrypt = require('bcrypt');
const salt = 10;


app.use(cors());
app.use(express.json());

app.listen(19001, () => {
  console.log("running");
});

//mysql connection
const db = mysql.createConnection({
  //local database
  host: "localhost",
  user: "root",
  password: "",
  // //old db
  // database: "samplebias",

  //new db
  database: "biasdatabase",


  // //for online database
  // host: "sql12.freesqldatabase.com",
  // user: "sql12650583",
  // password: "MIwKKAUnT7",
  // database: "sql12650583",
});

app.get("/", (req, res) => {
  return res.json("From Server");
});

/////FINAL SQL
app.post("/signupFinal", (req, res) => {
  const userType = req.body.userType;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const middleName = req.body.middleName;
  const bDate = req.body.bDate;
  const gender = req.body.gender;
  const userage = req.body.userage;
  const contactNum = req.body.contactNum;
  const email = req.body.email;
  const pass = req.body.pass;
  const provinceData = req.body.selectedProvince;
  const cityData = req.body.selectedCity;
  const brgyData = req.body.selectedBrgy;
  const createdAt = req.body.createdAt;


  db.query(
    "INSERT INTO usertbl (user_type, user_fname, user_lname, user_mname, user_bdate, user_gender, user_age, user_contact_num, user_email, user_password, user_province, user_city, user_barangay, user_created_at ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)",
    [userType, firstName, lastName, middleName, bDate, gender, userage, contactNum, email, pass,  provinceData, cityData, brgyData,createdAt],
(error, results) => {
  if (error) {
    console.log(error.errno);
    return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})



  } else {
    // res.send(results);
    return res.send({ success: true, results})

  }
}
);

});



app.post("/pitchFinal", (req, res) => {
const user = req.body.user;
const businessName = req.body.businessName;
const businessTypeSelectd = req.body.businessTypeSelectd;
const bussNameSelectd = req.body.bussNameSelectd;
const address = req.body.selectedProvince + ", " + req.body.selectedCity + ", " + req.body.selectedBrgy;
const imageURL =  req.body.imageURL;
const checkboxDataAdd =  req.body.bussStationYN;
const customTextAdd =  req.body.bussLocationAdd;
const checkboxExperience =  req.body.bussExperienceYN;
const customTextExp =  req.body.businesstExp;
const summary =  req.body.bussSummary;
const audience =  req.body.bussAudience;
const funds =  req.body.bussFunds;
const suppDoc =  req.body.buss_support_doc;
const businessCapital = req.body.businessCapital;
const credential = req.body.fileURL;
const month = 6;
const interest = 5;
const loanreturn = req.body.loanreturn;
const installment = req.body.installments;
const status = "pending"
const createdAt =  req.body.createdAt;



  db.query(
    "INSERT INTO business (buss_name, buss_type, buss_type_name, buss_address, buss_photo, buss_station, buss_station_name, buss_experience, buss_prev_name, buss_summary, buss_target_audience, buss_useof_funds, buss_support_doc,  buss_capital,  buss_credentials, buss_no_of_months,  buss_interest, buss_loan_return,buss_installment, buss_status, buss_created_at, buss_user_id ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [businessName, businessTypeSelectd,  bussNameSelectd, address, imageURL, checkboxDataAdd, customTextAdd, checkboxExperience, customTextExp, summary,  audience, funds, JSON.stringify(suppDoc),  businessCapital, JSON.stringify(credential) , month, interest, loanreturn, JSON.stringify(installment), status, createdAt, user],
(error, results) => {
  if (error) {
    console.log(error);
  } else {
    res.send(results);
  }
}
);

});


app.post("/getIdFinal", (req, res) => {
  const id = req.body.user;

  db.query(
        "SELECT * FROM usertbl WHERE user_id = ?  ",
        // "SELECT * FROM usertbl INNER JOIN business ON  business.buss_user_id = usertbl.user_id  where user_id = ?",
    [id],
    (error, results) => {
      if (error) {
        console.log(error.errno);
        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
      } 
      else {

        return res.send({ success: true, results})
       
    
      }
        }
  );
});




app.get("/getInvestorsFeedsFinal", (req, res) => {
  const sql = "select business.*, usertbl.*, sum(investment.invst_amt) as totalAmountInvts  from business left join usertbl on usertbl.user_id=  business.buss_user_id left join investment on business.buss_id = investment.invst_buss_approved_buss_id  where buss_status = 'approved' and usertbl.user_type = 'entreprenuer' GROUP BY business.buss_id, usertbl.user_id order by business.buss_id  desc";
  // const sql ="select business.*, usertbl.* ,businessapproved.*, investor.user_id as investor_id ,investor.user_profile  as investor_profile, investor.user_fname as investor_fname, investor.user_lname as investor_lname ,investment.* from business left join usertbl on usertbl.user_id =  business.buss_user_id left join businessapproved on business.buss_id = businessapproved.buss_approved_buss_id left join investment on businessapproved.buss_approved_buss_id = investment.invst_buss_approved_buss_id left join usertbl as investor on investment.invst_user_id = investor.user_id where buss_status = 'approved' and usertbl.user_type = 'entreprenuer'"
  db.query(sql, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      return res.send(data);
    }
  });
});


app.get("/feedsSample", (req, res) => {
  const sql = "select business.*, usertbl.*, sum(investment.invst_amt) as totalAmountInvts  from business left join usertbl on usertbl.user_id=  business.buss_user_id left join investment on business.buss_id = investment.invst_buss_approved_buss_id  where buss_status = 'approved' and usertbl.user_type = 'entreprenuer' GROUP BY business.buss_id, usertbl.user_id order by business.buss_id  desc";
  db.query(sql, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      return res.send(data);
    }
  });
});





app.get("/getInvestorsFeedsFinals", (req, res) => {
  const userType = "entrepreneur";
  const status = "approved";
  db.query(
    "select business.*, usertbl.* ,businessapproved.*, investor.user_id as investor_id ,investor.user_profile as investor_profile, investor.user_fname as investor_fname, investor.user_lname as investor_lname ,investment.* from business left join usertbl on usertbl.user_id =  business.buss_user_id left join businessapproved on business.buss_id = businessapproved.buss_approved_buss_id left join investment on businessapproved.buss_approved_buss_id = investment.invst_buss_approved_buss_id left join usertbl as investor on investment.invst_user_id = investor.user_id  where buss_status = ? and usertbl.user_type = ?",
    [status, userType],
    (error, result) => {
      if (error) {
        return res.send({ success: false, error: error });
      } else {
        const businessWithInvestment = [];

        const resultsSet = result;

        resultsSet.forEach((row) => {
          let business = businessWithInvestment.find(
            (item) => item.buss_id === row.buss_id
          );

          if (!business) {
            business = {
              buss_id: row.buss_id,
              buss_name: row.buss_name,
              buss_type: row.buss_type,
              buss_type_name: row.buss_type_name,
              buss_address: row.buss_address,
              buss_photo: row.buss_photo,
              buss_station: row.buss_station,
              buss_station_name: row.buss_station_name,
              buss_experience: row.buss_experience,
              buss_prev_name: row.buss_prev_name,
              buss_summary: row.buss_summary,
              buss_target_audience: row.buss_target_audience,
              buss_useof_funds: row.buss_useof_funds,
              buss_capital: row.buss_capital,
              buss_approved_updated_year: row.buss_approved_updated_year,
              buss_approved_percent: row.buss_approved_percent,
              investments: [],
            };
            businessWithInvestment.push(business);
          }

          business.investments.push({
            investor_id: row.investor_id,
            investor_profile: row.investor_profile,
            investor_fname: row.investor_fname,
            investor_lname: row.investor_lname,
            invest_amount: row.invst_amt,
          });
        });

        return res.send({
          success: true,
          result: businessWithInvestment,
          filterData: businessWithInvestment,
        });
      }
    });
});




app.post("/investmentFinal", (req, res) => {
  const amount = req.body.amountToInvest;
  const totalReturn = req.body.totalReturn;
  const status = "request";
  const months = 12;
  const interest = 3;
  const createdAt = req.body.createdAt;
  const user = req.body.user;
  const findBussinessID = req.body.findBussinessID;
  const findBussinessUser = req.body.findBussinessUser;

  
  
  
    db.query(
      "INSERT INTO investment (invst_amt, invst_returned_amt, invst_status, invst_num_month,  invst_interest, invst_created_at,  invst_user_id	, invst_buss_approved_buss_id ) VALUES (?,?,?,?,?,?,?,?)",
      [amount, totalReturn, status, months, interest, createdAt,  user, findBussinessID  ],
      (error, results) => {
        if (error) {
          console.log(error.errno);
          return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
      
        } 
        else {
          console.log("Investment")

          return res.send({ success: true, results})
         
      
        }
    }
  );
  
  });
  

  app.post("/notifFinal", (req, res) => {
    const msg = req.body.notifMsg;
    const notifType =  "investment";
    const createdAt = req.body.createdAt;
    const user = req.body.user;
    const status =  "unread";
    const findBussinessUser = req.body.findBussinessUser;

    
  
    db.query(
        // "SELECT * FROM users WHERE email = ? AND pass = ?",
       "INSERT INTO notification (notif_content, notif_type, notif_created_at, user_id_reciever, notif_status ) VALUES (?,?,?,?,?)",
      [msg, notifType, createdAt,findBussinessUser, status ],
      (error, results) => {
        if (error) {
          console.log(error.errno);
          return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
      
        } 
        else {
          console.log("Inserted")

          return res.send({ success: true, results})
         
      
        }
        }
    );
  });
  
    

//newest 
  app.post("/notificationsFinal", (req, res) => {
    const msg = req.body.notifMsg;
    const notifType =  "investment";
    const createdAt = req.body.createdAt;
    const user = req.body.user;
    const status =  "unread";
    const findBussinessUser = req.body.findBussinessUser;
    const referenceID = req.body.bussinessID;
  
    
  
    db.query(
       "INSERT INTO notification (notif_content, notif_type, notif_created_at, user_id_reciever, notif_status, notif_reference_id ) VALUES (?,?,?,?,?,?)",
      [msg, notifType, createdAt,findBussinessUser, status,referenceID ],
      (error, results) => {
        if (error) {
          console.log(error.errno);
          return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
      
        } 
        else {
          console.log("Inserted")
  
          return res.send({ success: true, results})
         
      
        }
        }
    );
  });
  
  

  app.post("/NotficationTypeInvest", (req, res) => {
    const notifID = req.body.notifID;
    const invstID = req.body.invstID;
  
    
    
      db.query(
        "INSERT INTO notif_type_invest (notif_type_id_invest, notif_type_investment_id) VALUES (?,?)",
        [notifID, invstID ],
    (error, results) => {
      if (error) {
        console.log("fk error")

        console.log(error);
      } else {
        res.send(results);
        console.log("fk inserted")
      }
    }
    );
    
    });



    app.post("/getNotifDisplayFinal", (req, res) => {
      const user = req.body.user;
    
      db.query(
        "select notification.*, usertbl.user_id as investorID,  usertbl.user_fname as investors_fname, usertbl.user_lname as investors_lname, usertbl.user_profile as investorProfile, business.buss_id as businessID from notification inner join business on business.buss_id = notification.notif_reference_id inner join businessapproved on business.buss_id  = businessapproved.buss_approved_buss_id inner join investment on investment.invst_buss_approved_buss_id = businessapproved.buss_approved_buss_id inner join usertbl on investment.invst_user_id = usertbl.user_id where  notification.notif_type = 'investment' and notification.user_id_reciever = ? group by notif_id order by notif_id desc",
        // "select * from notification inner join notif_type_invest on notification.notif_id = notif_type_invest.notif_type_id_invest inner join investment on notif_type_invest.notif_type_investment_id = investment.invst_id inner join usertbl on investment.invst_user_id = usertbl.user_id where user_id_reciever =?",    
        [user],
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            res.send(results);
          }
        }
      );
    
    });
    
    
  

    app.post("/FilterSearch", (req, res) => {
      const useSearch = req.body.useSearch;
    
      db.query(
      "select business.*, usertbl.*, sum(investment.invst_amt) as totalAmountInvts from business left join usertbl on usertbl.user_id=  business.buss_user_id left join investment on business.buss_id = investment.invst_buss_id where buss_status = 'Pending' and usertbl.user_type = 'entreprenuer' and  buss_type_name LIKE 'Baking' GROUP BY business.buss_id, usertbl.user_id order by business.buss_id  desc ",        
      [useSearch],
        (error, results) => {
          if (error) {
            console.log(error);
            return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
        
          } 
          else {
    
            return res.send({ success: true, results})
           
        
          }
            }
      );
    });

    app.get('/search', (req, res) => {
      const query = req.query.useSearch; // Extract the 'query' parameter from the URL
    
      if (!query) {
        return res.json([]);
      }
    
      // const sql = `SELECT * FROM your_table WHERE column_name LIKE '%${query}%'`;
    //  const sql = `select business.*, usertbl.*, sum(investment.invst_amt) as totalAmountInvts from business left join usertbl on usertbl.user_id=  business.buss_user_id left join investment on business.buss_id = investment.invst_buss_id where buss_status = "Pending" and usertbl.user_type = "entreprenuer" and  buss_type_name LIKE '%${query}%' GROUP BY business.buss_id, usertbl.user_id order by business.buss_id  desc `;       
     const sql = `select business.*, usertbl.* ,businessapproved.*, sum(investment.invst_amt) as totalAmountInvts, investor.user_id as investor_id ,investor.user_profile as investor_profile, investor.user_fname as investor_fname, investor.user_lname as investor_lname , investment.* from business left join usertbl on usertbl.user_id =  business.buss_user_id left join businessapproved on business.buss_id = businessapproved.buss_approved_buss_id left join investment on businessapproved.buss_approved_buss_id = investment.invst_buss_approved_buss_id left join usertbl as investor on investment.invst_user_id = investor.user_id where buss_status = 'approved' and usertbl.user_type = 'entreprenuer' and  buss_type_name LIKE '%${query}%'`;
    
      db.query(sql, (err, results) => {
        if (err) {
          console.error('Database query error: ' + err.message);
          return res.status(500).json({ error: 'Database error' });
        }
    
        res.json(results);
      });
    });
    
    

    app.post("/getNotifCount", (req, res) => {
      const user = req.body.user;
      db.query(
      "SELECT count(notif_status) as status from notification WHERE notif_status = 'unread' AND user_id_reciever =?",        [user],
        (error, results) => {
          if (error) {
            console.log(error.errno);
            return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
        
          } 
          else {
    
            return res.send({ success: true, results})
           
        
          }
            }
      );
    });
    

    app.post("/NotifStatusRead", (req, res) => {
      const notifStatusID = req.body.notifID;
      const statusRead = "read";
      db.query(
         "UPDATE notification SET notif_status = ? WHERE notif_id = ? ",
        [ statusRead, notifStatusID],
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Updated")
            res.send(results);
          }
        }
      );
    });





    app.post("/updateProfileFinal", (req, res) => {
      const user = req.body.user;
      const {
        userType,
        firstName,
        lastName,
        middleName,
        bDate,
        selectedgender,
        userage,
        contactNum,
        email,
        pass,
        selectedProvince,
        selectedCity,
        selectedBrgy,
        imageURL,
        createdAt,
      } = req.body;
    
      // Retrieve existing data for the user from the database
      db.query(
        "SELECT * FROM usertbl WHERE user_id = ?",
        [user],
        (selectError, selectResults) => {
          if (selectError) {
            console.log(selectError.errno);
            console.log("failed to retrieve existing data");
            return res.send({ success: false, failed: selectError.sqlMessage, errorNum: selectError.errno });
          }
    
          if (selectResults.length === 0) {
            return res.send({ success: false, message: "User not found." });
          }
    
          const existingData = selectResults[0];
    
          // Merge the existing data with the new data, but prioritize new data if it exists
          const updatedData = {
            user_type: userType || existingData.user_type,
            user_fname: firstName || existingData.user_fname,
            user_lname: lastName || existingData.user_lname,
            user_mname: middleName || existingData.user_mname,
            user_bdate: bDate || existingData.user_bdate,
            user_gender: selectedgender || existingData.user_gender,
            user_age: userage || existingData.user_age,
            user_contact_num: contactNum || existingData.user_contact_num,
            user_email: email || existingData.user_email,
            user_password: pass || existingData.user_password,
            user_province: selectedProvince || existingData.user_province,
            user_city: selectedCity || existingData.user_city,
            user_barangay: selectedBrgy || existingData.user_barangay,
            user_profile: imageURL || existingData.user_profile,
            user_updated_at: createdAt || new Date(),
          };
    
          // Update the database with the merged data
          db.query(
            "UPDATE usertbl SET user_type = ?, user_fname = ?, user_lname = ?, user_mname = ?, user_bdate = ?, user_gender = ?, user_age = ?, user_contact_num = ?, user_email = ?, user_password = ?, user_province = ?, user_city = ?, user_barangay = ?, user_profile = ?, user_updated_at = ? WHERE user_id = ?",
            [
              updatedData.user_type,
              updatedData.user_fname,
              updatedData.user_lname,
              updatedData.user_mname,
              updatedData.user_bdate,
              updatedData.user_gender,
              updatedData.user_age,
              updatedData.user_contact_num,
              updatedData.user_email,
              updatedData.user_password,
              updatedData.user_province,
              updatedData.user_city,
              updatedData.user_barangay,
              updatedData.user_profile,
              updatedData.user_updated_at,
              user,
            ],
            (updateError, updateResults) => {
              if (updateError) {
                console.log(updateError.errno);
                console.log("failed");
                console.log(updateError)
                return res.send({ success: false, failed: updateError.sqlMessage, errorNum: updateError.errno });
              } else {
                console.log("success");
                return res.send({ success: true, results: updateResults });
              }
            }
          );
        }
      );
    });
        






    app.post("/ViewBussiness", (req, res) => {
      const id = req.body.bussID;
    
      db.query(
          " select business.*, usertbl.* ,businessapproved.*,  sum(investment.invst_amt) as totalAmountInvts, investor.user_id as investor_id ,investor.user_profile as investor_profile, investor.user_fname as investor_fname, investor.user_lname as investor_lname ,investment.* from business left join usertbl on usertbl.user_id =  business.buss_user_id left join businessapproved on business.buss_id = businessapproved.buss_approved_buss_id left join investment on businessapproved.buss_approved_buss_id = investment.invst_buss_approved_buss_id left join usertbl as investor on investment.invst_user_id = investor.user_id where buss_status = 'approved' and usertbl.user_type = 'entreprenuer' and business.buss_id = ?",
        [id],
        (error, results) => {
          if (error) {
            console.log(error.errno);
            return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
        
          } 
          else {
    
            return res.send({ success: true, results})
           
        
          }
            }
      );
    });


    

    app.post("/TransactionInvest", (req, res) => {
      const type = req.body.type;
      const amount = req.body.amount;
      const email = req.body.email;
      const formattedDate = req.body.formattedDate;
      const user = req.body.user;

        db.query(
          "INSERT INTO transactions (transac_type, transac_amt, transac_email, transac_created_at,  transac_user_id ) VALUES (?,?,?,?,?)",
          [type, amount, email, formattedDate, user ],
      (error, results) => {
        if (error) {
          console.log("error")
  
          console.log(error);
        } else {
          res.send(results);
          console.log("Inserted")
        }
      }
      );
      
      });
  
  
    
        
        



/////////////////END OF FINAL SQL





app.get("/userss", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      return res.send(data);
    }
  });
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;
  const name = req.body.name;

  db.query(
      // "SELECT * FROM users WHERE email = ? AND pass = ?",
     "INSERT INTO users (fullname, email, pass) VALUES (?, ?, ?)",
    [name, email, pass],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
});

app.post("/testing", (req, res) => {
  const userType = req.body.userType;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const middleName = req.body.middleName;
  db.query(
      // "SELECT * FROM users WHERE email = ? AND pass = ?",
     "INSERT INTO testing (user_type, user_firstname, user_lastname, user_middlename,) VALUES (?, ?, ?, ?)",
    [userType, firstName, lastName, middleName,],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
});



app.post("/image", (req, res) => {
  const imageURL = req.body.imageURL;

  db.query(
      // "SELECT * FROM users WHERE email = ? AND pass = ?",
     "INSERT INTO image (img_url) VALUES (?)",
    [imageURL],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
});

app.get("/getImage", (req, res) => {
  const sql = "SELECT * FROM image";
  db.query(sql, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      return res.send(data);
    }
  });
});


app.get("/getData", (req, res) => {
  const sql = "SELECT * FROM usertbl";
  db.query(sql, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      return res.send(data);
    }
  });
});



app.get("/getLogin", (req, res) => {

    const sql = "SELECT * FROM usertbl WHERE user_email = ? AND user_pass = ?";
  db.query(sql, (error, results) => {
  if (error) {
    console.log(error.errno);
    return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})

  } 
  else {
    return res.send({ success: true, results})

  }
}
);

});


// for online server
app.post("/testserverLogin", (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;

  db.query(
        // "SELECT * FROM usertbl WHERE user_email = ? AND user_password = ? ",
        "SELECT * FROM usertbl WHERE user_email = ? ",

    email,
    (error, results) => {
      if (error) {
        
        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
      } 
      else {
        
        if(results.length>0){
        
          bcrypt.compare(pass, results[0].user_password, (error, response) =>{

            if(response){
              return res.send({succes: true, results})
            }
            else {
              return res.send({ success: false, })

            }
          })
        return res.send({ success: true, results})

        }
        else{
        return res.send({ success: false})
          
        }
    
      }
        }
  );
});

//local
app.post("/testLogin", (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;

  db.query(
        "SELECT * FROM usertbl WHERE user_email = ? AND user_password = ? ",
        
    [email, pass],
    (error, results) => {
      if (error) {
        console.log(error.errno);
        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
      } 
      else {

        if(results.length>0){
        return res.send({ success: true, results})

        }
        else{
        return res.send({ success: false})
          
        }
    
      }
        }
  );
});



app.post("/testID", (req, res) => {
  const id = req.body.user;
  const pass = req.body.pass;

  db.query(
        "SELECT * FROM usertbl WHERE user_id = ?  ",
        // "SELECT * FROM usertbl INNER JOIN business ON  business.buss_user_id = usertbl.user_id  where user_id = ?",
    [id],
    (error, results) => {
      if (error) {
        console.log(error.errno);
        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
      } 
      else {

        return res.send({ success: true, results})
       
    
      }
        }
  );
});


app.post("/ProfileFeeds", (req, res) => {
  const id = req.body.user;
  const pass = req.body.pass;

  db.query(
        // "SELECT * FROM usertbl WHERE user_id = ?  ",
        "SELECT * FROM usertbl INNER JOIN business ON  business.buss_user_id = usertbl.user_id  where user_id = ?",
    [id],
    (error, results) => {
      if (error) {
        console.log(error.errno);
        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
      } 
      else {

        return res.send({ success: true, results})
       
    
      }
        }
  );
});



app.post("/ProfileViewFeeds", (req, res) => {
  const id = req.body.user;
  const pass = req.body.pass;

  db.query(
        // "SELECT * FROM usertbl WHERE user_id = ?  ",
        // "SELECT * FROM usertbl INNER JOIN business ON  business.buss_user_id = usertbl.user_id  where user_id = ?",
     "select business.*, usertbl.*, sum(investment.invst_amt) as totalAmountInvts  from business left join usertbl on usertbl.user_id=  business.buss_user_id left join investment on business.buss_id = investment.invst_buss_approved_buss_id  where buss_status = 'approved' and usertbl.user_type = 'entreprenuer' and business.buss_user_id = ? GROUP BY business.buss_id, usertbl.user_id order by business.buss_id  desc",

        [id],
    (error, results) => {
      if (error) {
        console.log(error.errno);
        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
      } 
      else {

        return res.send({ success: true, results})
       
    
      }
        }
  );
});







app.post("/pitch", (req, res) => {
  const user = req.body.user;
const businessName = req.body.businessName;
const businessTypeSelectd = req.body.businessTypeSelectd;
const businessCapital = req.body.businessCapital;
const businessDetails =  req.body.businessDetails;
// const selectedProvince =  req.body.selectedProvince;
// const selectedCity =  req.body.selectedCity;
// const selectedBrgy =  req.body.selectedBrgy;
const address = req.body.selectedProvince + ", " + req.body.selectedCity + ", " + req.body.selectedBrgy;
const createdAt =  req.body.createdAt;
const imageURL =  req.body.imageURL;



  db.query(
    "INSERT INTO business (buss_name, buss_type, buss_capital, buss_address, buss_photo, buss_details, buss_created_at, buss_user_id ) VALUES (?,?,?,?,?,?,?,?)",
    [businessName, businessTypeSelectd,  businessCapital, address, imageURL, businessDetails, createdAt, user],
(error, results) => {
  if (error) {
    console.log(error);
  } else {
    res.send(results);
  }
}
);

});




app.post("/signup", (req, res) => {
  const userType = req.body.userType;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const middleName = req.body.middleName;
  const bDate = req.body.bDate;
  const gender = req.body.gender;
  const contactNum = req.body.contactNum;
  const email = req.body.email;
  const pass = req.body.pass;
  const provinceData = req.body.selectedProvince;
  const cityData = req.body.selectedCity;
  const brgyData = req.body.selectedBrgy;
  const createdAt = req.body.createdAt;


  db.query(
    "INSERT INTO usertbl (user_type, user_fname, user_lname, user_mname, user_bdate, user_gender, user_contact_num, user_email, user_password, user_province, user_city, user_barangay, user_created_at ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [userType, firstName, lastName, middleName, bDate, gender, contactNum, email, pass,  provinceData, cityData, brgyData,createdAt],
(error, results) => {
  if (error) {
    console.log(error.errno);
    // res.send({ success: false})

    // switch(error.errno) {
    //   case 1062:
    //     console.log("error")
    //     return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    //     break;
    // }
    return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})



  } else {
    // res.send(results);
    return res.send({ success: true, results})

  }
}
);

});






app.post("/duplication", (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;
  const name = req.body.name;

  db.query(
        "SELECT * FROM users WHERE email = ? ",
    [name, email, pass],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );

});

  app.post("/updateprofile", (req, res) => {
    // const userType = req.body.userType;
    const id = req.body.id;

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const middleName = req.body.middleName;
    const bDate = req.body.bDate;
    const gender = req.body.gender;
    const contactNum = req.body.contactNum;
    const email = req.body.email;
    const pass = req.body.pass;
    // const regionData = req.body.regionData;
    const provinceData = req.body.selectedProvince;
    const cityData = req.body.selectedCity;
    const brgyData = req.body.selectedBrgy;
    const createdAt = req.body.createdAt;
  
  
  
  
    db.query(
      // "UPDATE INTO usertbl ( user_firstname, user_lastname, user_middlename, user_bdate, user_gender, user_contct_num, user_email, user_pass, user_province, user_city, user_brgy, user_created_at ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      // [ firstName, lastName, middleName, bDate, gender, contactNum, email, pass,  provinceData, cityData, brgyData,createdAt],

      "UPDATE usertbl SET user_type = ?, user_fname = ?, user_lname = ?, user_mname = ?, user_bdate = ?, user_gender = ?, user_contact_num = ?, user_email = ?, user_password = ?, user_province = ?, user_city = ?, user_barangay = ?, user_updated_at WHERE usertbl.user_id  = ?",
    [firstName, lastName, middleName, bDate, gender, contactNum, email, pass,  provinceData, cityData, brgyData,createdAt, ],

  (error, results) => {
    if (error) {
      console.log(error.errno);
      return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
  
    } else {
      // res.send(results);
      return res.send({ success: true, results})
  
    }
  }
  );
  
  });
  
  


app.get("/getBusiness", (req, res) => {
  const sql = "SELECT * FROM business";
  db.query(sql, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      return res.send(data);
    }
  });
});



// select * from usertbl inner join business on business.buss_user_id = usertbl.user_id ;
app.get("/getFeedsDisplay", (req, res) => {
  // const sql = "SELECT * FROM usertbl INNER JOIN business ON business.buss_user_id = usertbl.user_id";

  // const sql = "SELECT * FROM usertbl  INNER JOIN business ON usertbl.user_id = business.buss_user_id  INNER JOIN investment ON business.buss_user_id = investment.invst_user_id" ;
  const sql = "select business.*, usertbl.*, sum(investment.invst_amt) as totalAmountInvts  from business left join usertbl on usertbl.user_id=  business.buss_user_id left join investment on business.buss_id = investment.invst_buss_id  where buss_status = 'Pending' and usertbl.user_type = 'Entreprenuer' GROUP BY business.buss_id, usertbl.user_id order by business.buss_id  desc"

  db.query(sql, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      return res.send(data);
    }
  });
});



// Define API endpoints for sending notifications
app.post('/sendNotification', (req, res) => {
  // Implement the logic to send notifications here

  
});




app.post("/fileUpload", (req, res) => {
  const fileURL = req.body.fileURL;

  db.query(
      // "SELECT * FROM users WHERE email = ? AND pass = ?",
     "INSERT INTO files (file_url) VALUES (?)",
    [fileURL],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
});

app.get("/getFile", (req, res) => {
  const sql = "SELECT * FROM files";
  db.query(sql, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      return res.send(data);
    }
  });
});




app.post("/notif", (req, res) => {
  const msg = req.body.notifMsg;
  const user = req.body.user;
  const createdAt = req.body.createdAt;
  const findBussinessUser = req.body.findBussinessUser;
  const findBussinessID = req.body.findBussinessID;
  const invstID = req.body.invstID;


  db.query(
      // "SELECT * FROM users WHERE email = ? AND pass = ?",
     "INSERT INTO notification (notif_content, notif_created_at, user_id_reciever, user_id_sender,  user_buss_id,invst_id) VALUES (?,?,?,?,?,?)",
    [msg, createdAt,user, findBussinessUser, findBussinessID,invstID ],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Inserted")
        res.send(results);
      }
    }
  );
});




app.post("/getNotifDisplay", (req, res) => {
  const user = req.body.user;

  db.query(
        "SELECT * FROM usertbl INNER JOIN notification ON  notification.user_id_reciever = usertbl.user_id  where user_id_sender = ?; ",
        // "SELECT * FROM usertbl INNER JOIN notificationtest ON  notificationtest.user_id_reciever = usertbl.user_id  where user_id_sender = ?; ",

    [user],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );

});






app.post("/testbussID", (req, res) => {
  // const user = req.body.user;

  db.query(
        "SELECT * FROM usertbl RIGHT JOIN business ON business.buss_user_id = usertbl.user_id",
  //  [user],
    (error, results) => {
      if (error) {
        console.log(error.errno);
        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
      } 
      else {

        if(results.length>0){
        return res.send({ success: true, results})

        }
        else{
        return res.send({ success: false})
          
        }
    
      }
        }
  );
});




app.post("/investment", (req, res) => {
  // const percent = req.body.percent;
  // const year = req.body.year;
  const year = 1;
  // const startDate = req.body.startDate;
  // const endDate = req.body.endDate;
  // const percentReturn = req.body.percentReturn;
  const amount = req.body.amountToInvest;
  // const interest = req.body.interest;
  const interest = 2;
  const createdAt = req.body.createdAt;
  const user = req.body.user;
  const findBussinessID = req.body.findBussinessID;
  const findBussinessUser = req.body.findBussinessUser;
  const invstType = "annuity"
  const type = "investment"
  const amountAt = parseFloat(amount) * -1;





  db.query(
      // "SELECT * FROM users WHERE email = ? AND pass = ?",
     "INSERT INTO investment (invst_amt, invst_num_year,  invst_interest, invst_created_at, invst_user_id	, invst_buss_id, invst_buss_user_id, invst_type	 ) VALUES (?,?,?,?,?,?,?,?)",
    [amount, year, interest, createdAt, user, findBussinessID, findBussinessUser,invstType  ],
    (error, results) => {


      // if (error) {
      //   console.log(error);
      // } else {
      //   res.send(results);
      // }

      if (error) {
        console.log(error.errno);
        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
      } 
      else {

        return res.send({ success: true, results})


      //   db.query(
      //     "INSERT INTO wallet (wlt_user_id, user_amt, wlt_trans_type ) VALUES (?,?,?)",
      //     [user,amountAt, type],
      //    (error, results) => {
     
      //      if (error) {
      //        console.log(error.errno);
      //        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
         
      //      } 
      //      else {
     
      //        return res.send({ success: true, results})
             
      //        // console.log(results);
      //       //  const wallet_id = results.insertId
     
      //       //  db.query(
      //       //    "INSERT INTO transactions (trans_amt,trans_email,trans_created_at,wlt_id ) VALUES (?,?,?,?)",
      //       //    [amount,email, createdAt,wallet_id],
      //       //   (error, results) => {
          
      //       //     if (error) {
      //       //       console.log(error.errno);
      //       //       return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
              
      //       //     } 
      //       //     else {
          
      //       //       return res.send({ success: true, results})
      //       //     }
          
          
          
      //       //   }
      //       // );
      //      }
      //    }
      //  );
     
       
    
      }



    }
  );
});


app.post("/investmentwallet", (req, res) => {
  const amount = req.body.amountToInvest;
  const user = req.body.user;
  const type = "investment"
  const amountAt = parseFloat(amount) * -1;



        db.query(
          "INSERT INTO wallet (wlt_user_id, user_amt, wlt_trans_type ) VALUES (?,?,?)",
          [user,amountAt, type],
         (error, results) => {
     
           if (error) {
             console.log(error.errno);
             return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
         
           } 
           else {
     
             return res.send({ success: true, results})
             
             // console.log(results);
            //  const wallet_id = results.insertId
     
            //  db.query(
            //    "INSERT INTO transactions (trans_amt,trans_email,trans_created_at,wlt_id ) VALUES (?,?,?,?)",
            //    [amount,email, createdAt,wallet_id],
            //   (error, results) => {
          
            //     if (error) {
            //       console.log(error.errno);
            //       return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
              
            //     } 
            //     else {
          
            //       return res.send({ success: true, results})
            //     }
          
          
          
            //   }
            // );
           }
         }
       );
     
       
    
});



app.post("/IDimage", (req, res) => {
  const imageURL = req.body.imageURL;

  db.query(
      // "SELECT * FROM users WHERE email = ? AND pass = ?",
     "INSERT INTO informationImages (img_url) VALUES (?)",
    [imageURL],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
});


app.get("/getIDimage", (req, res) => {
  const sql = "SELECT * FROM informationImages";
  db.query(sql, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      return res.send(data);
    }
  });
});






app.post("/BussStatus", (req, res) => {
  const status = req.body.status;
  const bussID = req.body.bussID;

  db.query(
      // "SELECT * FROM users WHERE email = ? AND pass = ?",
     "UPDATE business SET buss_status = ? WHERE buss_id = ?;   ",
    [status, bussID ],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Updated")
        res.send(results);
      }
    }
  );
});


// app.get("/displayInvestor", (req, res) => {
//   // const sql = "SELECT * FROM usertbl INNER JOIN business ON usertbl.user_id = business.buss_user_id INNER JOIN investment ON business.buss_user_id = investment.invst_user_id where buss_id=?";
//   const buss_id = req.body.bussid;

//   const sql ="SELECT * FROM usertbl INNER JOIN business ON usertbl.user_id = business.buss_user_id INNER JOIN investment ON business.buss_id = investment.invst_buss_id where buss_id=? ";
//   db.query(sql,  [buss_id ], (error, data) => {
//     if (error) {
//       console.log(error);
//     } else {
//       return res.send(data);
//     }
//   });
// });

app.post("/displayInvestor", (req, res) => {
  const buss_id = req.body.bussid;
// console.log(buss_id);
  db.query(
      // "SELECT * FROM users WHERE email = ? AND pass = ?",
    //  "SELECT * FROM usertbl INNER JOIN business ON usertbl.user_id = business.buss_user_id INNER JOIN investment ON business.buss_id = investment.invst_buss_id where buss_id=?",
     "SELECT * FROM usertbl INNER JOIN investment ON usertbl.user_id = investment.invst_user_id INNER JOIN business on business.buss_id = investment.invst_buss_id WHERE buss_id=?",
    [buss_id],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
});




app.post("/InvsmntStatusDecline", (req, res) => {
  const statusDecline = req.body.statusDecline;
  const userID = req.body.userID;

  db.query(
      // "SELECT * FROM users WHERE email = ? AND pass = ?",
     "UPDATE investment SET invst_status = ? WHERE invst_user_id = ?;   ",
    [statusDecline, userID ],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Updated")
        res.send(results);
      }
    }
  );
});

app.post("/InvsmntStatusAccepted", (req, res) => {
  const statusAccepted = req.body.statusAccepted;
  const userID = req.body.userID;

  db.query(
      // "SELECT * FROM users WHERE email = ? AND pass = ?",
     "UPDATE investment SET invst_status = ? WHERE invst_user_id = ?;   ",
    [statusAccepted, userID ],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Updated")
        res.send(results);
      }
    }
  );
});



app.post("/invstmntView", (req, res) => {
  const userData = req.body.userData;
  const notifId = req.body.notifId;


  db.query(
    //  "INSERT INTO files (file_url) VALUES (?)",
     "select business.*, usertbl.*,notification.* from business left join usertbl on usertbl.user_id=  business.buss_user_id left join notification on business.buss_id = notification.user_buss_id where notification.user_id_reciever  = ? and notification.notif_id = ? ",
    [userData,notifId],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
});



app.post("/InvstmentFeeds", (req, res) => {
  const id = req.body.userID;
  const notifID = req.body.notifID;
  const bussID = req.body.bussID;
  const invstID = req.body.invstID;



  db.query(
        // "SELECT * FROM usertbl WHERE user_id = ?  ",
        // "select notification.*, usertbl.*,business.* from business left join usertbl on usertbl.user_id=  business.buss_user_id left join notification on business.buss_id = notification.user_buss_id where notification.user_id_reciever = ? and notification.notif_id = ? and business.buss_id=?",
        // "SELECT * FROM usertbl INNER JOIN notification ON usertbl.user_id = notification.user_id_reciever where notification.notif_id=?",
        // "select  usertbl.*,notification.*,business.* from business left join usertbl on usertbl.user_id=  business.buss_user_id left join notification on business.buss_id = notification.user_buss_id where usertbl.user_id = ? and notification.user_id_reciever = ? and notification.notif_id =?",
    // [id,id,notifID],

    "SELECT * FROM usertbl INNER JOIN investment ON usertbl.user_id = investment.invst_user_id INNER JOIN business on business.buss_id = investment.invst_buss_id WHERE invst_id = ?",
    [invstID],

    (error, results) => {
      if (error) {
        console.log(error.errno);
        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
      } 
      else {

        return res.send({ success: true, results})
       
    
      }
        }
  );
});








app.get("/UserList", (req, res) => {
  const sql = "SELECT * FROM usertbl";
  db.query(sql, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      return res.send(data);
    }
  });
});



app.post("/wallet", (req, res) => {
  
  const amount = req.body.amount;
  const user = req.body.user;
  const type = req.body.type;
  const name = req.body.name;
  const email = req.body.email;
  const formattedDate = req.body.formattedDate;

  
  db.query(
     "INSERT INTO wallet (wlt_user_id, user_amt, wlt_trans_type ) VALUES (?,?,?)",
     [user,amount, type],
    (error, results) => {

      if (error) {
        console.log(error.errno);
        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
      } 
      else {

        // return res.send({ success: true, results})
        // console.log(results);
        const wallet_id = results.insertId

        db.query(
          "INSERT INTO transactions (trans_amt,trans_email,trans_created_at,wlt_id ) VALUES (?,?,?,?)",
          [amount,email, formattedDate,wallet_id],
         (error, results) => {
     
           if (error) {
             console.log(error.errno);
             return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
         
           } 
           else {
     
             return res.send({ success: true, results})
           }
     
     
     
         }
       );
      }
    }
  );
});


app.post("/WalletSum", (req, res) => {
  const id = req.body.user;

  db.query(
    "select sum(user_amt) as totalamount from wallet where wlt_user_id = ?",
    // "SELECT * FROM usertbl INNER JOIN business ON  business.buss_user_id = usertbl.user_id  where user_id = ?",
    [id],
    (error, results) => {
      if (error) {
        console.log(error.errno);
        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
      } 
      else {

        return res.send({ success: true, results})
       
    
      }
        }
  );
});






app.post("/handleSendCode", (req, res) => {
  const email = req.body.email;
 
  db.query(
        "SELECT * FROM usertbl WHERE user_email = ?",
        
    [email],
    (error, results) => {
      if (error) {
        console.log(error.errno);
        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
      } 
      else {

        if(results.length>0){
        return res.send({ success: true, results, code: "1234"})

        }
        else{
        return res.send({ success: false})
          
        }
    
      }
        }
  );
});



// app.post("/UpdateUserPass", (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password
//   db.query(
//         "UPDATE usertbl SET user_password = ? where user_email = ?",
//     [email,password],
//     (error, results) => {
//       if (error) {
//         // console.log(error);
//         return res.send({status: false, message: error.message})
//       } 
//       else {
//         return res.send({status: true, message:"Password Changed"})
//       }
//     }
//   );

// });


app.post("/UpdateUserPass", (req, res) => {
  const email = req.body.email;
  const password = req.body.password
  
  db.query(
      "UPDATE usertbl SET user_password = ? where user_email = ?",
  [password, email],
      (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Updated")
        res.send(results);
      }
    }
  );
});


// app.post("/updateProfilee", (req, res) => {
//   const user = req.body.user;
//   const userType = req.body.userType;
//   const firstName = req.body.firstName;
//   const lastName = req.body.lastName;
//   const middleName = req.body.middleName;
//   const imageURL = req.body.imageURL;
//   const bDate = req.body.bDate;
//   const gender = req.body.gender;
//   const contactNum = req.body.contactNum;
//   const email = req.body.email;
//   const pass = req.body.pass;
//   const provinceData = req.body.selectedProvince;
//   const cityData = req.body.selectedCity;
//   const brgyData = req.body.selectedBrgy;
//   const createdAt = req.body.createdAt;


//   db.query(
//     "UPDATE usertbl SET user_type = ?, user_fname = ?, user_lname = ?, user_mname = ?, user_profile_photo = ?, user_bdate = ?, user_gender = ?, user_contact_num = ?, user_email = ?, user_password = ?, user_province = ?, user_city = ?, user_barangay = ?, user_updated_at = ? WHERE usertbl.user_id = ?",
//       [userType, firstName, lastName, middleName, imageURL, bDate, gender, contactNum, email, pass,  provinceData, cityData, brgyData,createdAt,user],
// (error, results) => {
//   if (error) {
//     console.log(error.errno);
//     console.log("failed")
//     return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
//   } else {
//     // res.send(results);
//     console.log("success")
//     return res.send({ success: true, results})

//   }
// }
// );

// });



app.post("/updateProfilee", (req, res) => {
  const user = req.body.user;
  const updateData = req.body;

  // Retrieve existing data for the user from the database
  db.query(
    "SELECT * FROM usertbl WHERE user_id = ?",
    [user],
    (selectError, selectResults) => {
      if (selectError) {
        console.log(selectError.errno);
        console.log("failed to retrieve existing data");
        return res.send({ success: false, failed: selectError.sqlMessage, errorNum: selectError.errno });
      }

      if (selectResults.length === 0) {
        return res.send({ success: false, message: "User not found." });
      }

      const existingData = selectResults[0];

      // Merge the existing data with the new data, but prioritize new data if it exists
      const updatedData = {
        user_type: updateData.userType || existingData.user_type,
        user_fname: updateData.firstName || existingData.user_fname,
        user_lname: updateData.lastName || existingData.user_lname,
        user_mname: updateData.middleName || existingData.user_mname,
        user_profile_photo: updateData.imageURL || existingData.user_profile_photo,
        user_bdate: updateData.bDate || existingData.user_bdate,
        user_gender: updateData.gender || existingData.user_gender,
        user_contact_num: updateData.contactNum || existingData.user_contact_num,
        user_email: updateData.email || existingData.user_email,
        user_password: updateData.pass || existingData.user_password,
        user_province: updateData.selectedProvince || existingData.user_province,
        user_city: updateData.selectedCity || existingData.user_city,
        user_barangay: updateData.selectedBrgy || existingData.user_barangay,
        user_updated_at: updateData.createdAt || new Date(),
      };

      // Update the database with the merged data
      db.query(
        "UPDATE usertbl SET user_type = ?, user_fname = ?, user_lname = ?, user_mname = ?, user_profile_photo = ?, user_bdate = ?, user_gender = ?, user_contact_num = ?, user_email = ?, user_password = ?, user_province = ?, user_city = ?, user_barangay = ?, user_updated_at = ? WHERE user_id = ?",
        [
          updatedData.user_type,
          updatedData.user_fname,
          updatedData.user_lname,
          updatedData.user_mname,
          updatedData.user_profile_photo,
          updatedData.user_bdate,
          updatedData.user_gender,
          updatedData.user_contact_num,
          updatedData.user_email,
          updatedData.user_password,
          updatedData.user_province,
          updatedData.user_city,
          updatedData.user_barangay,
          updatedData.user_updated_at,
          user,
        ],
        (updateError, updateResults) => {
          if (updateError) {
            console.log(updateError.errno);
            console.log("failed");
            return res.send({ success: false, failed: updateError.sqlMessage, errorNum: updateError.errno });
          } else {
            console.log("success");
            return res.send({ success: true, results: updateResults });
          }
        }
      );
    }
  );
});



app.post("/getNotifContent", (req, res) => {
  const user = req.body.user;
  db.query(
    " SELECT notif_content as content from notification WHERE notif_status = 'unread' AND user_id_sender = ? limit 1",
    [user],
    (error, results) => {
      if (error) {
        console.log(error.errno);
        return res.send({ success: false, failed: error.sqlMessage, errorNum: error.errno})
    
      } 
      else {

        return res.send({ success: true, results})
       
    
      }
        }
  );
});
