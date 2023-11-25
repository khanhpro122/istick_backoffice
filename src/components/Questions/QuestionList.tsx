// Libraries
import { TQuestion } from '@/types/event';
import { Dispatch, SetStateAction } from 'react';
import { SortableContainer, SortableContainerProps } from 'react-sortable-hoc';
import QuestionItem from './QuestionItem';
import { arrayMove } from '@/utils';

  type TProps = {
    setEventQuestions: Dispatch<SetStateAction<TQuestion[]>>,
    eventQuestions: TQuestion[]
  }


  interface ISortableContainer extends SortableContainerProps {
    children: React.ReactNode
}

  const SortContainer:React.ComponentClass<ISortableContainer, any> = SortableContainer(({children}: ISortableContainer) => {
    return <>{children}</>
  })
  

  const QuestionList = ({setEventQuestions, eventQuestions}: TProps) => {
    const onSortEnd = ({ oldIndex, newIndex }: {oldIndex: number, newIndex: number}) => {
      setEventQuestions(prev => {
          return arrayMove(prev, oldIndex, newIndex)
        })
      }

    return (
        <SortContainer axis="xy" onSortEnd={onSortEnd} useDragHandle lockToContainerEdges>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {eventQuestions?.map((question, index) => {
                    return (
                        <QuestionItem 
                            index={index}
                            key={question?.id} 
                            question={question} 
                            eventQuestions={eventQuestions} 
                            setEventQuestions={setEventQuestions} 
                        />
                    )
                })}
            </div>
        </SortContainer>
    );
  }
  
  export default QuestionList;
  
  