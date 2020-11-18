import { Box, Button, Card, CardContent, CircularProgress, Grid, Step, StepLabel, Stepper } from '@material-ui/core';
import { Field, Form, Formik, FormikConfig, FormikValues } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-material-ui'
import { object, mixed, number } from 'yup';
import React, {useState} from 'react'

const sleep = (time) => new Promise((acc)=>setTimeout(acc, time))

export default function Home() {
  return (
    <Card>
      <CardContent>
        <FormikStepper 
        
        initialValues={{
          firstName: '',
          lastName: '',
          millionaire: false,
          money: 0,
          description:""
        }}
        onSubmit={async(values)=>{
          await sleep(3000)
          console.log('values',values)
        }}
        >
          
            
            <FormikStep label="naam wagera">
            <Box paddingBottom={2}>
            <Field fullWidth name="firstName" component={TextField} label="First Name"></Field>
            </Box>
            <Box paddingBottom={2}>
            <Field fullWidth name="lasttName" component={TextField} label="Last Name"></Field>
            </Box>
            <Box paddingBottom={2}>
            <Field name="millionaire" type = "checkbox" component={CheckboxWithLabel} Label={{label: 'i am a millionaire'}}></Field>
            </Box>
            </FormikStep>
            <FormikStep label="the money you have"
            validationSchema={object({
              money: mixed().when('millionaire',{
                is: true,
                then: number().required().min(1_000_000, "because u said u are a millionar, you should have enough money"),
                otherwise: number().required()
              })
            })}
            
            >
              <Box paddingBottom={2}>
            <Field fullWidth name="money" type="number" component={TextField} label="All the money i have"></Field>
            </Box>
            </FormikStep>
            <FormikStep label="more info">
            <Box paddingBottom={2}>
            <Field fullWidth name="description" component={TextField} label="Description"></Field>
            </Box>
            </FormikStep>
          
        </FormikStepper>
      </CardContent>
    </Card>
  );
}

export interface FormikStepProps extends Pick<FormikConfig<FormikValues>, 'children' | 'validationSchema'>{
    label: string;
}

export function FormikStep({children}: FormikStepProps) {
  return <>{children}</>
}

export function FormikStepper({children, ...props}: FormikConfig<FormikValues>) {
const childrenArray = React.Children.toArray(children) as React.ReactElement<FormikStepProps>[]
const [step,setStep] = useState(0);
const [completed,setCompleted]= useState(false)
const currentChild = childrenArray[step]


function isLastStep (){
  return step === childrenArray.length-1
}
return (
<Formik
{...props}
validationSchema={currentChild.props.validationSchema}


onSubmit={async(values,helpers)=>{
  if(isLastStep()){
    await props.onSubmit(values,helpers)
    setCompleted(true)
    helpers.resetForm()
  } else { setStep(s=> s+1)}
}}>
  {({isSubmitting})=>(

  
  <Form autoComplete="off">
<Stepper alternativeLabel activeStep={step}>
        {childrenArray.map((child, index) => (
          <Step key={child.props.label}  completed={step > index || completed}>
            <StepLabel>{child.props.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
  
  {currentChild}
  <Grid container spacing={2}>
{step > 0 ? (
  <Grid item>
    <Button disabled={isSubmitting} variant="contained" color="primary" onClick={()=> setStep(s=> s-1)}>Back</Button>
  </Grid>
) : null}

<Grid>
<Button startIcon={isSubmitting? <CircularProgress size="1rem" /> : null } disabled={isSubmitting} variant="contained" color="primary" type="submit">
  
  {isSubmitting? 'Submitting' : isLastStep()? 'submit' : 'next'}</Button></Grid></Grid>

</Form>)}

</Formik>)


}