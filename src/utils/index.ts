export const generateKey = (length: number): string => {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      const selectedChar = characters.charAt(randomIndex);
      result += selectedChar;
    }
  
    return result;
}

export function arrayMove(arr: any[], fromIndex: number, toIndex: number) {
  if (fromIndex < 0 || fromIndex >= arr.length || toIndex < 0 || toIndex >= arr.length) {
    return arr;
  }

  const result = [...arr];
  const [movedElement] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, movedElement);
  return result;
}

export function removeIdRecursively(data: any): any {
  if (Array.isArray(data)) {
      return data.map(removeIdRecursively);
  } else if (typeof data === 'object' && data !== null) {
    if (data.isNew === true) {
        const { id, isNew, ...rest } = data;
        for (const key in rest) {
            rest[key] = removeIdRecursively(rest[key]);
        }
        return rest;
    } else {
      for (const key in data) {
        data[key] = removeIdRecursively(data[key]);
      }
      return data;
    }
  }
  return data;
}

export const convertValueMultiple = (values:any) => {
  try {
    const results:any = {}
    values?.forEach((item:any) => {
      results[item?.id] = item?.content
    });
    return results
  } catch (error) {
    return {}
  }
}

export const convertValuesFromId = (ids:any, parentId:any, objectValue:any) => {
  try {
    const result = ids?.map((id:any) => {
      return objectValue?.[parentId]?.value?.[String(id)]
    })
    return result
  } catch (error) {
    return []
  }
}

export const convertDataAnswer = (answers: any, eventQuestions: any) => {
  try {
    const userIds:any = []
    const results:any = []
    const questionObject:any = {}
    eventQuestions?.forEach((ques:any) => {
      questionObject[ques?.id] = {
        question : ques?.content,
        value: ques?.questionType !== 'TEXT' ? convertValueMultiple(ques?.choices) : ''
      }
    });
    answers.forEach((ans:any) => {
      if(!userIds?.includes(ans?.userId)) {
        results.push({
          id: ans?.userId,
          fullname: ans?.fullname,
          email: ans?.email,
          [questionObject?.[ans?.eventQuestion?.id]?.question]: ans?.eventQuestion?.questionType === 'TEXT' ? ans?.answer : convertValuesFromId(ans?.eventQuestionChoiceIds, ans?.eventQuestion?.id, questionObject)
        })
        userIds?.push(ans?.userId)
      }else {
        const findItem = results?.find((item:any) => item?.id === ans?.userId)
        if(findItem) {
          findItem[questionObject?.[ans?.eventQuestion?.id]?.question] =  ans?.eventQuestion?.questionType === 'TEXT' ? ans?.answer : convertValuesFromId(ans?.eventQuestionChoiceIds, ans?.eventQuestion?.id, questionObject)
        }
      }
    })
    return results
  }catch(e) {
    return []
  }
}

export const mergeTwoData = (register:any, mapQuestion:any) => {
  try {
    const results:any = []
    register.forEach((res: any) => {
      const objectAns:any = {}
      res?.answers?.forEach((ans:any) => {
        objectAns[mapQuestion[ans?.eventQuestionId]?.question] = mapQuestion[ans?.eventQuestionId]?.questionType === 'TEXT' ? ans?.answer : convertValuesFromId(ans?.eventQuestionChoiceIds, ans?.eventQuestionId, mapQuestion)
      });
      results.push({
        ...res,
        ...objectAns
      })
    })
    return results
  } catch (error) {
    return []
  }
}

export const checkAndConvertValue = (values:string[], options:any) => {
  try {
    const skillsAdded: string[] = []
    const objectMap:any = {}
    options?.forEach((item :any) => {
      if(item?.value) {
        objectMap[item?.value] = true
      }
    })
    values?.forEach((item:any) => {
      if(!objectMap[item]) {
        skillsAdded?.push(item)
      }
    })
    if(skillsAdded?.length) {
      const newOption =  skillsAdded?.map((item:String) => ({
        label: item,
        value: item
      }))
      return [...options, ...newOption]
    }
    return null
  } catch (error) {
    return null
  }
}

export const convertArrayToTags = (skills: string[] | any[], levels?: string[]) => {
  try {
    const result:any = [];
    skills?.forEach((skill) => {
      result.push({
        name: skill,
        tagType: 'SKILL'
      })
    })
    if(levels?.length) {
      levels?.forEach((level) => {
        result.push({
          name: level,
          tagType: 'LEVEL'
        })
      })
    }
    return result;
  }catch(e) {
    return []
  }
}

export const convertValues = (arr: any, type: string) => {
  try {
    let result = []
    result = arr?.filter((tag:any) => tag?.tagType === type)?.map((item:any) => item?.tag?.name)
    return result;
  }catch(e) {
    return []
  }
}


export function findMaxId(arr: { id: number }[]): number {
  let maxId = Number.MIN_SAFE_INTEGER;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id > maxId) {
      maxId = arr[i].id;
    }
  }
  return maxId;
}