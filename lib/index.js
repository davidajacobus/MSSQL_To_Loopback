//export default {};
  var fs = require('fs');
  var sql = require('mssql');


  const iterateQuery = "DECLARE @tableName NVARCHAR(max) " +
  "DECLARE @command NVARCHAR(max) " +
  "DECLARE @schema varchar(8000); " +
  "DECLARE @result varchar(8000); " +
  "DECLARE IdentityUpdate_Cursor CURSOR FOR " +
  "SELECT DISTINCT t.name AS table_name " +
  "FROM sys.tables AS t " +
  "ORDER BY table_name " +
  "OPEN IdentityUpdate_Cursor " +
  "FETCH NEXT FROM IdentityUpdate_Cursor INTO @tableName " +
  "SET @result = ''" +
  "WHILE @@FETCH_STATUS = 0 " +
  "BEGIN " +
    "SET @schema = ' :{' " +

    "SELECT @schema =  '''use strict''' +" +
    "'module.exports = function(' + REPLACE(@tableName,'tbl','') + ') { };'" +
    "SET @result = @result + @schema + ' } ' " +
    "FETCH NEXT FROM IdentityUpdate_Cursor INTO @tableName " +
  "END " +
  "CLOSE IdentityUpdate_Cursor " +
  "DEALLOCATE IdentityUpdate_Cursor " +
  "SELECT @result ";

  runQuery();

  function runQuery(){

  sql.connect("mssql://username:password@server/db").then(function() {

    // Query
    new sql.Request().query(iterateQuery).then(function (recordset) {
      console.log(recordset);

    }).catch(function (err) {
      console.log(err.message);
    });

  });

  }



