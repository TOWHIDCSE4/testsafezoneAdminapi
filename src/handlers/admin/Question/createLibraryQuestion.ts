import { error, success, init, validateService } from '@/modules/core';
import { LibraryQuestionModel } from '@/models/LibraryQuestion';
const extractQuestionAndAnswers = (text: string) => {
  const questionRegex = /Câu hỏi:\s*([\s\S]+?(?=(Câu hỏi:|$)))/g;

    const questionMatches = [...text.matchAll(questionRegex)];

    const questionsData = questionMatches.map(match => {
        const questionPart = match[1];
        const question = questionPart.substring(0,questionPart.indexOf('A.'));
        const correctAnsIndex = questionPart.indexOf('Đáp án');
        const ans1 = questionPart.substring(questionPart.indexOf('A.'), questionPart.indexOf('B.'))
        const ans2 = questionPart.substring(questionPart.indexOf('B.'), questionPart.indexOf('C.'))
        const ans3 = questionPart.substring(questionPart.indexOf('C.'), questionPart.indexOf('D.'))
        var ans4 = "";
        if(correctAnsIndex>0){
          ans4 = questionPart.substring(questionPart.indexOf('D.'), correctAnsIndex)
        }else{
          ans4 = questionPart.substring(questionPart.indexOf('D.'))
        }
        
        const answers = [ ans1, ans2, ans3, ans4]
        if(ans4.indexOf('\n')>0){
          ans4 = ans4.substring(0,ans4.indexOf('\n'))
        }
        var correct = [];
        if(correctAnsIndex>0){
          const last_part = questionPart.substring(correctAnsIndex)
          if(last_part){
            if(last_part.indexOf('A.')>0){
              correct.push(ans1);
            }
            if(last_part.indexOf('B.')>0){
              correct.push(ans2);
            }
            if(last_part.indexOf('C.')>0){
              correct.push(ans3);
            }
            if(last_part.indexOf('D.')>0){
              correct.push(ans4);
            }
          }
        }

        return { question, answers, correct };
    });

    return questionsData;
};

export const createLibraryQuestion = validateService(async (event) => {
  await init();
  const {
    result_title,
    result_content,
    params,
    category,
    age,
    subject
  } = JSON.parse(event.body);

  try {
    const questionsData = extractQuestionAndAnswers(result_content);
    if(questionsData.length>0){
      const questionArr = questionsData.map(item=>{
        const question = item.question?.replace('\n','');
        const correct = item.correct;
        const answers = item.answers?.map(ans=>{
          const isCorrect = correct.find(i=> i===ans);
          const splitArr = ans.split('.');
          return {
            label: splitArr[0],
            text: splitArr[1].replace('\n',''),
            is_correct: typeof(isCorrect) !=='undefined'
          }
        });

        return (
          {
            answers: answers,
            audio: '',
            description: question,
            result_content: result_content,
            image: '',
            name: result_title,
            category: category,
            age: age,
            params:params,
            subject_id:subject,
            video: '',
            correct_answer: correct,
            incorrect_answer: null
          }
        )

             
      })
      const questions = await LibraryQuestionModel.create(questionArr);
      return success({
        code: '10000',
        data: questions,
        message: 'Success',
      });
    }

    return success({
      code: '10000',
      data: {},
      message: 'No Question found!',
    });
    

  
  } catch (e) {
    return error(e);
  }
});
