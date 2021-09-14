const fs = require("fs")
const parse = require("csv-parser")

// console.log(csv.toString())
const setTreshold = () => {
  let count = 0
  let currentDataTransaction = 0
  const foodCount = {}
  fs.createReadStream("data.csv")
    .pipe(parse({}))
    .on("data", (data) => {
      if (data["Transaction"] !== currentDataTransaction) {
        count++
        currentDataTransaction = data["Transaction"]
      }
      foodCount[data["Item"]] = foodCount[data["Item"]] + 1 || 1
    })
    .on("end", () => {
      const sortedResult = Object.entries(foodCount).sort(([, a], [, b]) => b - a)
      // I defined threshold as 4 items left.
      const [item1, item2, item3, item4] = [...sortedResult]
      const threshold = item4[1] / count
      let supp1 = item1[1] / count
      let supp2 = item2[1] / count
      let supp3 = item3[1] / count
      let supp4 = item4[1] / count
      console.log("Support Threshold: ", threshold)
      console.log("_____________1-ITEMSET SUPPORT_____________")
      console.log("___________________________________________")

      console.log(
        `Supp(${item1[0]}): ${supp1.toFixed(4)} | Supp(${item2[0]}): ${supp2.toFixed(4)} | Supp(${item3[0]}): ${supp3.toFixed(4)} | Supp(${
          item4[0]
        }): ${supp4.toFixed(4)}`
      )
      refineFirstStep([item1[0], item2[0], item3[0], item4[0]], [supp1, supp2, supp3, supp4])
    })
}

const refineFirstStep = (arr, suppArr) => {
  console.log("item list: ", arr.join(" "))
  const result = {}
  fs.createReadStream("data.csv")
    .pipe(parse({}))
    .on("data", (data) => {
      if (arr.includes(data.Item)) {
        result[data["Transaction"]] = result[data["Transaction"]] ? [...result[data["Transaction"]], data["Item"]] : [data["Item"]]
      }
    })
    .on("end", () => {
      twoItemSet(arr, result, suppArr)
    })
}
const twoItemSet = (arr, obj, suppArr) => {
  let itemSet12 = 0
  let itemSet13 = 0
  let itemSet14 = 0
  let itemSet23 = 0
  let itemSet24 = 0
  let itemSet34 = 0
  let total = 0
  for (const value of Object.values(obj)) {
    total++
    if (value.includes(arr[0]) && value.includes(arr[1])) itemSet12++
    if (value.includes(arr[0]) && value.includes(arr[2])) itemSet13++
    if (value.includes(arr[0]) && value.includes(arr[3])) itemSet14++
    if (value.includes(arr[1]) && value.includes(arr[2])) itemSet23++
    if (value.includes(arr[1]) && value.includes(arr[3])) itemSet24++
    if (value.includes(arr[2]) && value.includes(arr[3])) itemSet34++
  }
  let supp12 = itemSet12 / total
  let supp13 = itemSet13 / total
  let supp14 = itemSet14 / total
  let supp23 = itemSet23 / total
  let supp24 = itemSet24 / total
  let supp34 = itemSet34 / total
  console.log("     ")
  console.log("_____________2-ITEMSET SUPPORT_____________")
  console.log("___________________________________________")
  console.log(`${arr[0]} & ${arr[1]} => ${itemSet12}/${total} ${supp12.toFixed(4)}`)
  console.log(`${arr[0]} & ${arr[2]} => ${itemSet13}/${total} ${supp13.toFixed(4)}`)
  console.log(`${arr[0]} & ${arr[3]} => ${itemSet14}/${total} ${supp14.toFixed(4)}`)
  console.log(`${arr[1]} & ${arr[2]} => ${itemSet23}/${total} ${supp23.toFixed(4)}`)
  console.log(`${arr[1]} & ${arr[3]} => ${itemSet24}/${total} ${supp24.toFixed(4)}`)
  console.log(`${arr[2]} & ${arr[3]} => ${itemSet34}/${total} ${supp34.toFixed(4)}`)

  console.log("     ")
  console.log("_____________2-ITEMSET CONFIDENT_____________")
  console.log("_____________________________________________")

  console.log(`Conf() => Supp(X∪Y)/Supp(X)`)
  console.log(`Conf(${arr[0]} -> ${arr[1]}) => ${supp12.toFixed(4)}/${suppArr[0].toFixed(4)} = ${(supp12 / suppArr[0]).toFixed(4)}`)
  console.log(`Conf(${arr[1]} -> ${arr[0]}) => ${supp12.toFixed(4)}/${suppArr[1].toFixed(4)} = ${(supp12 / suppArr[1]).toFixed(4)}`)
  console.log(`Conf(${arr[0]} -> ${arr[2]}) => ${supp13.toFixed(4)}/${suppArr[0].toFixed(4)} = ${(supp13 / suppArr[0]).toFixed(4)}`)
  console.log(`Conf(${arr[2]} -> ${arr[0]}) => ${supp13.toFixed(4)}/${suppArr[2].toFixed(4)} = ${(supp13 / suppArr[2]).toFixed(4)}`)
  console.log(`Conf(${arr[0]} -> ${arr[3]}) => ${supp14.toFixed(4)}/${suppArr[0].toFixed(4)} = ${(supp14 / suppArr[0]).toFixed(4)}`)
  console.log(`Conf(${arr[3]} -> ${arr[0]}) => ${supp14.toFixed(4)}/${suppArr[3].toFixed(4)} = ${(supp14 / suppArr[3]).toFixed(4)}`)
  console.log(`Conf(${arr[1]} -> ${arr[2]}) => ${supp23.toFixed(4)}/${suppArr[1].toFixed(4)} = ${(supp23 / suppArr[1]).toFixed(4)}`)
  console.log(`Conf(${arr[2]} -> ${arr[1]}) => ${supp23.toFixed(4)}/${suppArr[2].toFixed(4)} = ${(supp23 / suppArr[2]).toFixed(4)}`)
  console.log(`Conf(${arr[1]} -> ${arr[3]}) => ${supp24.toFixed(4)}/${suppArr[1].toFixed(4)} = ${(supp24 / suppArr[1]).toFixed(4)}`)
  console.log(`Conf(${arr[3]} -> ${arr[1]}) => ${supp24.toFixed(4)}/${suppArr[3].toFixed(4)} = ${(supp24 / suppArr[3]).toFixed(4)}`)
  console.log(`Conf(${arr[2]} -> ${arr[3]}) => ${supp34.toFixed(4)}/${suppArr[2].toFixed(4)} = ${(supp34 / suppArr[2]).toFixed(4)}`)
  console.log(`Conf(${arr[3]} -> ${arr[2]}) => ${supp34.toFixed(4)}/${suppArr[3].toFixed(4)} = ${(supp34 / suppArr[3]).toFixed(4)}`)

  console.log("     ")
  console.log("_____________2-ITEMSET LIFT_____________")
  console.log("________________________________________")
  console.log(`LIFT() => Supp(X∪Y)/Supp(X)*Supp(Y)`)
  console.log(
    `LIFT(${arr[0]} -> ${arr[1]}) => ${supp12.toFixed(4)}/(${suppArr[0].toFixed(3)}*${suppArr[1].toFixed(3)}) = ${(
      supp12 /
      (suppArr[0] * suppArr[1])
    ).toFixed(4)}`
  )
  console.log(
    `LIFT(${arr[0]} -> ${arr[2]}) => ${supp13.toFixed(4)}/(${suppArr[0].toFixed(3)}*${suppArr[2].toFixed(3)}) = ${(
      supp13 /
      (suppArr[0] * suppArr[2])
    ).toFixed(4)}`
  )
  console.log(
    `LIFT(${arr[0]} -> ${arr[3]}) => ${supp14.toFixed(4)}/(${suppArr[0].toFixed(3)}*${suppArr[3].toFixed(3)}) = ${(
      supp14 /
      (suppArr[0] * suppArr[3])
    ).toFixed(4)}`
  )
  console.log(
    `LIFT(${arr[1]} -> ${arr[2]}) => ${supp23.toFixed(4)}/(${suppArr[1].toFixed(3)}*${suppArr[2].toFixed(3)}) = ${(
      supp23 /
      (suppArr[1] * suppArr[2])
    ).toFixed(4)}`
  )
  console.log(
    `LIFT(${arr[1]} -> ${arr[3]}) => ${supp24.toFixed(4)}/(${suppArr[1].toFixed(3)}*${suppArr[3].toFixed(3)}) = ${(
      supp24 /
      (suppArr[1] * suppArr[3])
    ).toFixed(4)}`
  )
  console.log(
    `LIFT(${arr[2]} -> ${arr[3]}) => ${supp34.toFixed(4)}/(${suppArr[2].toFixed(3)}*${suppArr[3].toFixed(3)}) = ${(
      supp34 /
      (suppArr[2] * suppArr[3])
    ).toFixed(4)}`
  )
}
const apriori = () => {
  setTreshold()
}

apriori()
