import React, { Component } from 'react';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { GlobalStyle } from '../theme/GlobalStyle.styled';
import ContactForm from '../ContactForm/ContactForm';
import Section from '../Section';
import ContactList from '../ContactList';
import Filter from '../Filter';

class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const savedContacts = localStorage.getItem('contacts');

    if (savedContacts) {
      this.setState({ contacts: JSON.parse(savedContacts) });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { contacts } = this.state;

    if (prevState.contacts !== contacts) {
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }
  }

  handleAddContact = newContact => {
    this.setState(
      ({ contacts }) => ({
        contacts: [...contacts, newContact],
      }),
      () => Notify.success('Contact is added to the phonebook')
    );
  };

  handleCheckUniqueContact = name => {
    const { contacts } = this.state;

    const isExistContact = !!contacts.find(contact => contact.name === name);

    if (isExistContact) {
      Notify.failure('Contact already exists');
    }

    return !isExistContact;
  };

  handleRemoveContact = id => {
    this.setState(
      ({ contacts }) => ({
        contacts: contacts.filter(contact => contact.id !== id),
      }),
      () => Notify.success('Contact is deleted')
    );
  };

  handleFilterChange = filter => this.setState({ filter });

  getVisibleContacts = () => {
    const { contacts, filter } = this.state;
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );
  };

  render() {
    const { filter } = this.state;
    const visibleContacts = this.getVisibleContacts();

    return (
      <>
        <GlobalStyle />
        <Section title="Phonebook">
          <ContactForm
            onAdd={this.handleAddContact}
            onCheckUnique={this.handleCheckUniqueContact}
          />
        </Section>
        <Section title="Contacts">
          <h3>Find contacts by name</h3>
          <Filter filter={filter} onChange={this.handleFilterChange} />
          <ContactList
            contacts={visibleContacts}
            onRemove={this.handleRemoveContact}
          />
        </Section>
      </>
    );
  }
}

export default App;
