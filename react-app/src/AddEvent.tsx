import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    padding: 16px;
    width: 960px;
`;

const Heading = styled.h2`
  color: var(--otago-blue-dark);
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const Label = styled.label`
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    width: 100%;
`;

const Input = styled.input`
    padding: 0.5rem;
    margin-top: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
`;

const Textarea = styled.textarea`
    padding: 0.5rem;
    margin-top: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: vertical;
`;

const Button = styled.button`
    padding: 0.5rem;
    background-color: #f9c003;
    color: black;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;

    &:hover {
        background-color: #e3af03;
        color: white;
    }
`;
interface EventFormData {
    title: string;
    location: string;
    startDate: Date;
    endDate: Date;
    description: string;
}

interface User {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
  }

const initialFormData: EventFormData = {
    title: "",
    location: "",
    startDate: new Date(),
    endDate: new Date(),
    description: "",
};


function CreateEventForm({ username, password }: { username: string; password: string }) {
    const [formData, setFormData] = useState<EventFormData>(initialFormData);
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);

    const authHeader = (username: string, password: string) => {
        const base64Credentials = btoa(`${username}:${password}`);
        return `Basic ${base64Credentials}`;
    };

    const headers = {
        Authorization: authHeader(username, password),
    };

    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const response = await axios.get("http://localhost:3001/user", {
              headers: {
                Authorization: authHeader(username, password),
              },
            });
            console.log(response.data)
            setUsers(response.data);
          } catch (error) {
            console.error(error);
          }
        };
      
        fetchUsers();
      }, [username, password]);

    const [selectedUser, setSelectedUser] = useState("");


    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;

        if (name === "startDate" || name === "endDate") {
            const date = new Date(value);
            setFormData({
                ...formData,
                [name]: date,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:3001/event",
                formData,
                { headers: headers }
            );
            // console.log(response.data);
            
            const eventId = response.data.eventId;
            const userId = selectedUser;

            const responseUserAssigned = await axios.post(
                `http://localhost:3001/event/${eventId}/assign/${userId}`,
                {},
                { headers: headers }
            );
            navigate("/events");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Wrapper>
            <Heading>Event Details</Heading>
            <Form onSubmit={handleSubmit}>
                <Label>
                    Title:
                    <Input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </Label>
                <Label>
                    Location:
                    <Input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                    />
                </Label>
                <Label>
                    Start Date:
                    <Input
                        type="datetime-local"
                        name="startDate"
                        value={formData.startDate.toISOString().slice(0, 16)}
                        onChange={handleChange}
                    />
                </Label>
                <Label>
                    End Date:
                    <Input
                        type="datetime-local"
                        name="endDate"
                        value={formData.endDate.toISOString().slice(0, 16)}
                        onChange={handleChange}
                    />
                </Label>
                <Label>
                    Description:
                    <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </Label>
                <Label>
                    User:
                    <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                        <option value="">Select a user</option>
                        {users.map((user) => (
                            <option key={user.userId} value={user.userId}>
                                {user.firstName + " " + user.lastName}
                            </option>
                        ))}
                    </select>
                </Label>

                <Button type="submit">Create Event</Button>
            </Form>
        </Wrapper>
    );
}

export default CreateEventForm;
