import { message } from 'antd';
import React, { useState } from 'react'
import { Button, Form, Col, Row, Container } from 'react-bootstrap';
import axiosInstance from '../common/AxiosInstance';

const AdminHome = () => {
    const [postQuiz, setPostQuiz] = useState({
        title: "",
        max_marks: "",
        questions: [{
            description: "",
            options: ["", "", "", ""],
            answer: ""
        }]
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPostQuiz({ ...postQuiz, [name]: value });
    };

    const handleChangeSection = (index, e) => {
        const { name, value } = e.target;
        const updatedQuestions = [...postQuiz.questions];

        if (name.startsWith("options")) {
            const optionIndex = parseInt(name.split("[")[1].split("]")[0], 10);
            updatedQuestions[index].options[optionIndex] = value;
        } else {
            updatedQuestions[index][name] = value;
        }

        setPostQuiz({ ...postQuiz, questions: updatedQuestions });
    };

    const handleAnswerBlur = (index, e) => {
        const answer = e.target.value.trim();
        const options = postQuiz.questions[index].options.map(opt => opt.trim());

        if (answer !== "" && !options.includes(answer)) {
            alert("The answer value must match one of the options.");
        }
    };

    const addInputGroup = () => {
        setPostQuiz({
            ...postQuiz,
            questions: [
                ...postQuiz.questions,
                {
                    description: "",
                    options: ["", "", "", ""],
                    answer: ""
                },
            ],
        });
    };

    const removeInputGroup = (index) => {
        const updatedQuestions = [...postQuiz.questions];
        updatedQuestions.splice(index, 1);
        setPostQuiz({
            ...postQuiz,
            questions: updatedQuestions,
        });
    };

    const handleSubmit = async () => {

        try {
            const res = await axiosInstance.post("/api/admin/postquiz", postQuiz, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (res.data.success) {
                message.success(res.data.message)
            }
            else {
                message.error(res.data.message)
            }
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <Form className="mb-5" onSubmit={handleSubmit}>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridTitle">
                    <Form.Label>Quiz Title:</Form.Label>
                    <Form.Control name='title' value={postQuiz.title} onChange={handleChange} type="text" placeholder="Enter Quiz Title" required />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridMaxMarks">
                    <Form.Label>Max. Marks:</Form.Label>
                    <Form.Control name='max_marks' value={postQuiz.max_marks} onChange={handleChange} type="text" placeholder="Enter Max. Marks" required />
                </Form.Group>
            </Row>

            <hr />

            {postQuiz.questions.map((question, index) => (
                <div key={index} className="question-container">
                    <span style={{ cursor: 'pointer' }} className="position-absolute top-0 end-0 p-1" onClick={() => removeInputGroup(index)}>
                        ❌
                    </span>
                    <Form.Group as={Row} controlId={`formGridQuestion${index}`} className="mb-3">
                        <Form.Label>{`Question ${index + 1}:`}</Form.Label>
                        <Col sm={12}>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={question.description}
                                onChange={(e) => handleChangeSection(index, e)}
                                placeholder="Enter Question"
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Row>
                        {question.options.map((option, optionIndex) => (
                            <Col key={optionIndex} sm={6} className="mb-3">
                                <Form.Group controlId={`formGridOption${optionIndex}-${index}`}>
                                    <Form.Label>{`Option ${optionIndex + 1}:`}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name={`options[${optionIndex}]`}
                                        value={option}
                                        onChange={(e) => handleChangeSection(index, e)}
                                        required
                                        placeholder={`Enter Option ${optionIndex + 1}`}
                                    />
                                </Form.Group>
                            </Col>
                        ))}
                    </Row>
                    <Row className='mb-3'>
                        <Form.Group as={Col} controlId={`formGridAnswer${index}`}>
                            <Form.Label>Answer:</Form.Label>
                            <Form.Control
                                name="answer"
                                value={question.answer}
                                onChange={(e) => handleChangeSection(index, e)}
                                onBlur={(e) => handleAnswerBlur(index, e)}
                                type="text"
                                placeholder="Enter Answer"
                                required
                            />

                        </Form.Group>
                    </Row>
                </div>
            ))}

            <Row className="mb-3">
                <Col xs={24} md={12} lg={8}>
                    <Button size='sm' variant='outline-secondary' onClick={addInputGroup}>
                        ➕ Add Question
                    </Button>
                </Col>
            </Row>

            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    )
}

export default AdminHome;