import ContactCollection from '../db/models/Contacts.js';

export const getContacts = () => ContactCollection.find();
export const getContactById = (id) => ContactCollection.findById(id);
export const addContact = (payload) => ContactCollection.create(payload);
export const updateContact = async (_id, payload, options = {}) => {
  const { upsert } = options;
  const result = await ContactCollection.findOneAndUpdate({ _id }, payload, {
    new: true,
    upsert,
    includeResultMetadata: true,
  });
  if (!result || !result.value) return null;

  const isNew = Boolean(result.lastErrorObject.upserted);

  return { isNew, data: result.value };
};

export const dleteContact = (filter) =>
  ContactCollection.findOneAndDelete(filter);
