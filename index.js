//modules
const fs = require("fs")
const path = require("path")


//Past the ABSOLUTE path of the file wich you want to sort in format C:\\foo\\bar
const DirPath = ""

/*

    This functions is a recursive function. It get all file and dir in a given directory.
    If it's a directory, the function recall him with the path of the dir in params and concat the results in fileListPath.
    If it's a file, the function push the file's path in an array (fileListPath) and the file's info
    return an array of object wich contains path for each files and theire info

*/
var GetAllFileInDir = (directoryPath) => {
    var dirContent = fs.readdirSync(directoryPath)
    var fileListPath = []
    for (const i in dirContent)
    {
        var info = fs.statSync(directoryPath + dirContent[i])

        if (info.isDirectory()) // check if the file is a directory
        {
            console.log("new dir found : " + (directoryPath + dirContent[i] + '\\') )
            fileListPath = fileListPath.concat(GetAllFileInDir(directoryPath + dirContent[i] + '\\'))

        } else {                // the file is a file
            console.log("new file found : " + (directoryPath + dirContent[i]))
            fileListPath.push({ 
                path : directoryPath + dirContent[i],
                stats : info
            })
        }
    }
    return fileListPath
}

/*

    Sort the given file list in descending order

*/

var SortByLastModified = (file) => {
    return file.sort((a , b) => b.stats.mtimeMs - a.stats.mtimeMs)
}



var fileList = GetAllFileInDir(DirPath)

var mostRecentFiles = SortByLastModified(fileList)

//Used to write the result in a .txt file
var buffer = mostRecentFiles.map((file) => file.path )

//Take the actual date to name the result .txt
const date = new Date()
var day = date.getDate(),
    month = date.getMonth() + 1,
    year = date.getFullYear(),
    minutes = date.getMinutes(),
    hours = date.getHours(),
    seconds = date.getSeconds()

if (day <= 9) day = `0${day}`
if (month <= 9) month = `0${month}`
if (seconds <= 9) seconds = `0${seconds}`

var resultFileName = `./${day}-${month}-${year}_${hours}${minutes}${seconds}_dump.txt`

//write results
fs.writeFileSync(resultFileName , buffer.join("\n") , { encoding : "utf-8" , flag : "w+"})

console.log(`results saved in : ${path.resolve(resultFileName)}`)