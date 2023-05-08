import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Event } from "./types";
import axios from "axios";

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

const Label = styled.label`
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    width: 100%;
`;

const Text = styled.p`
    font-size: 16px;
    margin-bottom: 8px;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 8px;
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

function EventDetails({
    username,
    password,
}: {
    username: string;
    password: string;
}) {
    const location = useLocation();
    const event: Event = location.state.event;
    const navigate = useNavigate();

    const authHeader = (username: string, password: string) => {
        const base64Credentials = btoa(`${username}:${password}`);
        return `Basic ${base64Credentials}`;
    };

    const headers = {
        Authorization: authHeader(username, password),
    };

    const editEvent = () => {
        navigate("/edit-event", { state: { event } }); // Pass the event as state
    };

    const deleteEvent = async () => {
        try {
            await axios.delete(`http://localhost:3001/event/${event.eventId}`, {
                headers: headers,
            });
            navigate("/events");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Wrapper>
            <Heading>{event.title}</Heading>
            <Label>
                Location:
                <Text>{event.location}</Text>
            </Label>
            <Label>
                Description:
                <Text>{event.description}</Text>
            </Label>
            <Label>
                Start Time:
                <Text>{new Date(event.startDate).toLocaleString()}</Text>
            </Label>
            <Label>
                End Time:
                <Text>{new Date(event.endDate).toLocaleString()}</Text>
            </Label>
            <ButtonContainer>
                <Button onClick={editEvent}>EDIT EVENT</Button>
                <Button onClick={deleteEvent}>DELETE EVENT</Button>
            </ButtonContainer>
        </Wrapper>
    );
}

export default EventDetails;
