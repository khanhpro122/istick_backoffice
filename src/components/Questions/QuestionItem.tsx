import { TQuestion } from '@/types/event';
import { Button, Checkbox, Input, Radio, Select, Switch } from 'antd';
import React, { Dispatch, SetStateAction } from 'react'
import { SortableElement, SortableElementProps, SortableHandle } from 'react-sortable-hoc';
import { CloseOutlined, EllipsisOutlined, PlusCircleFilled } from '@ant-design/icons'
import { generateKey } from '@/utils';


interface ISortableItem extends SortableElementProps {
    question? : TQuestion,
    setEventQuestions: Dispatch<SetStateAction<TQuestion[]>>,
    eventQuestions: TQuestion[]
}

type TProps = {
    question? : TQuestion,
    setEventQuestions: Dispatch<SetStateAction<TQuestion[]>>,
    eventQuestions: TQuestion[]
}

  const QuestionItem:React.ComponentClass<ISortableItem, any> = 
  SortableElement(({ question, setEventQuestions, eventQuestions }:TProps) => {

    // handle
    const handleOnChangeQuestion = (id:string, value:string) => {
        const cloneListQuestion = [...eventQuestions];
        const findedItem = cloneListQuestion?.find((item) => item?.id === id);
        if(findedItem) {
            findedItem['content'] = value
        }
        setEventQuestions(cloneListQuestion)
    }

    const handleOnChangeTypeQuestion = (id:string, value:string) => {
        const cloneListQuestion = [...eventQuestions];
        const findedItem = cloneListQuestion?.find((item) => item?.id === id);
        if(findedItem) {
            findedItem['questionType'] = value
            if(value === 'TEXT') {
                findedItem['choices'] = []
            }
        }
        setEventQuestions(cloneListQuestion)
    }

    const handleOnChangeAnswer = (idParent:string, idChild:string, value:string) => {
        const cloneListQuestion = [...eventQuestions];
        const findedItem = cloneListQuestion?.find((item) => item?.id === idParent);
        if(findedItem) {
            const findedChild = findedItem?.choices?.find((item) => item?.id === idChild)
            if(findedChild) {
                findedChild['content'] = value
            }
        }
        setEventQuestions(cloneListQuestion)
    }

    const handleDeleteQuestion = (id: string) => {
        const cloneListQuestion = [...eventQuestions];
        const filteredQues = cloneListQuestion?.filter((item) => item?.id !== id);
        setEventQuestions(filteredQues)
    }

    const handleDeleteAnswer = (idParent:string, idChild: string) => {
        const cloneListQuestion:TQuestion[] = [...eventQuestions];
        const findedItem = cloneListQuestion?.find((item) => item?.id === idParent);
        if(findedItem) {
            const newListAnswers = findedItem?.choices?.filter((item) => item?.id !== idChild)
            findedItem['choices'] = newListAnswers
        }
        setEventQuestions(cloneListQuestion)
    }

    const handleAddAnswer = (id: string) => {
        const cloneListQuestion:TQuestion[] = [...eventQuestions];
        const findedItem = cloneListQuestion?.find((item) => item?.id === id);
        if(findedItem) {
            const highestOrder = findedItem?.choices?.reduce(function (max, currentItem) {
                return Math.max(max, +currentItem.key);
            }, 0);
            const newAnswer = {
                content: '',
                id: generateKey(8),
                key: String(highestOrder + 1),
                isNew: true,
            }
            findedItem['choices'] = [...findedItem.choices, newAnswer]
        }
        setEventQuestions(cloneListQuestion)
    }

    const handleChangeReuired = (id: string, checked:boolean) => {
        const cloneListQuestion:TQuestion[] = [...eventQuestions];
        const findedItem = cloneListQuestion?.find((item) => item?.id === id);
        if(findedItem) {
            findedItem['required'] = checked
        }
        setEventQuestions(cloneListQuestion)
    }

    const DragHandle = SortableHandle(() => (
        <Button
            style={{color: '#1677ff', border: 'none', outline: 'none', cursor: 'grab'}} 
            icon={<EllipsisOutlined style={{fontSize: '24px'}} />}
        ></Button>
    ))

    return (
        <div style={{
            border: '1px solid #d9d9d9', 
            borderRadius: '10px', 
            padding: '20px',
          }}>
            <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                <DragHandle />
            </div>
            <div 
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}
            >
                <div style={{ flex: 1 }}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Select 
                            placeholder='Select type question' 
                            style={{ width: '200px' }} value={question?.questionType} 
                            onChange={(value) => handleOnChangeTypeQuestion(question?.id || '', value)}
                        >
                            <Select.Option value='TEXT'>Text</Select.Option>
                            <Select.Option value='SINGLE'>Single Choice</Select.Option>
                            <Select.Option value='MULTIPLE'>Multiple choice</Select.Option>
                        </Select>
                        <div style={{display: 'flex', gap: 6}}>
                            <label>Required</label>
                            <Switch checked={question?.required} onChange={(checked) => handleChangeReuired(question?.id || '', checked)} />
                        </div>
                    </div>
                    <div style={{margin: '10px 0', display: 'flex', flexDirection: 'column', gap: '6px'}}>
                        <label >Question name</label>
                        <Input placeholder="Enter your question" value={question?.content} onChange={(e:any) => handleOnChangeQuestion(question?.id || '', e.target.value)} />
                    </div>
                    {question?.questionType === 'MULTIPLE' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                            <label>Answer</label>
                            {question?.choices?.map((answer) => {
                                return (
                                    <div key={answer?.id} style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                        <Checkbox checked={false} />
                                        <Input 
                                            placeholder={`Answer ${answer?.key}`}
                                            style={{ width: '300px' }} 
                                            value={answer?.content} 
                                            onChange={(e:any) => handleOnChangeAnswer(question?.id || '', answer?.id || '', e.target.value)} 
                                        />
                                        {question?.choices?.length > 1 && (
                                            <Button 
                                                style={{color: '#1677ff', border: 'none'}} 
                                                icon={<CloseOutlined />}
                                                onClick={() => handleDeleteAnswer(question?.id || '', answer?.id)}
                                            ></Button>
                                        )}
                                    </div>
                                )
                            })}
                            <Button 
                                style={{color: '#1677ff', border: 'none'}} 
                                icon={<PlusCircleFilled />}
                                onClick={() => handleAddAnswer(question?.id || '')}
                            >Add answer</Button>
                        </div>
                    )}
                    {question?.questionType === 'SINGLE' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
                            <label>Answer</label>
                            {question?.choices?.map((answer) => {
                                return (
                                    <div key={answer?.id} style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                        <Radio checked={false} />
                                        <Input 
                                            placeholder={`Answer ${answer?.key}`}
                                            style={{ width: '300px' }} 
                                            value={answer?.content} 
                                            onChange={(e:any) => handleOnChangeAnswer(question?.id || '', answer?.id || '', e.target.value)} 
                                        />
                                        {question?.choices?.length > 1 && (
                                            <Button 
                                                style={{color: '#1677ff', border: 'none'}} 
                                                icon={<CloseOutlined />}
                                                onClick={() => handleDeleteAnswer(question?.id || '', answer?.id)}
                                            ></Button>
                                        )}
                                    </div>
                                )
                            })}
                             <Button 
                                style={{color: '#1677ff', border: 'none'}} 
                                icon={<PlusCircleFilled />}
                                onClick={() => handleAddAnswer(question?.id || '')}
                            >Add answer</Button>
                        </div>
                    )}
                </div>
                {eventQuestions?.length > 1 && (
                    <Button 
                        style={{color: '#1677ff', border: 'none'}} 
                        icon={<CloseOutlined style={{fontSize: '20px'}} />}
                        onClick={() => handleDeleteQuestion(question?.id || '')}
                    ></Button>
                )}
            </div>
          </div>
    );
  });


export default QuestionItem