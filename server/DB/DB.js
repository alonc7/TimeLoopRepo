const { MongoClient, ObjectId } = require('mongodb');

class DB {
    client;
    db_name;
    constructor() {
        this.client = new MongoClient(process.env.DB_URI);
        this.db_name = process.env.DB_NAME;
    }

    //Create
    async Insert(collection, docs) {
        try {
            await this.client.connect();
            if (docs.length)
                return await this.client.db(this.db_name).collection(collection).insertMany(docs);
            else
                return await this.client.db(this.db_name).collection(collection).insertOne(docs);
        } catch (error) {
            return error;
        }
        finally {
            await this.client.close();
        }
    }

    //Read
    async FindAll(collection, query = {}, project = {}) {
        try {
            await this.client.connect();
            const cursor = this.client.db(this.db_name).collection(collection).find(
                query, project);
            const result = await cursor.toArray();
            return result;
            // return await this.client.db(this.db_name).collection(collection).find(query, project).toArray();
        } catch (error) {
            console.error('Failed to retrieve documents:', error);
            throw error;
        }
        finally {
            await this.client.close();
        }
    }
    async FindOne(collection, query = {}, project = {}) {
        try {
            await this.client.connect();
            const document = await this.client.db(this.db_name).collection(collection).findOne(query, project);
            return document;
        } catch (error) {
            console.error('Failed to retrieve document:', error);
            throw error;
        }
        finally {
            await this.client.close();
        }
    }

    //Update
    async UpdateById(collection, id, doc) {
        try {
            await this.client.connect();
            return await this.client.db(this.db_name).collection(collection).updateOne(
                { _id: new ObjectId(id) },
                { $set: { ...doc } }
            );
        } catch (error) {
            return error;
        }
        finally {
            await this.client.close();
        }
    }

    //Delete
    async Deactive(collection, id) {
        try {
            await this.client.connect();
            return await this.client.db(this.db_name).collection(collection).updateOne(
                { _id: new ObjectId(id) },
                { $set: { is_active: false } }
            );
        } catch (error) {
            return error;
        }
        finally {
            await this.client.close();

        }
    }
    async CompleteTask(collection, userEmail, taskId) {
        try {
            await this.client.connect();
            const result = await this.client.db(this.db_name).collection(collection).updateOne(
                {
                    email: userEmail,
                    'Tasks.key': taskId // Match the specific user with the current email and task with the provided taskId in the query
                },
                {
                    $set: { 'Tasks.$[task].status': 'completed' } // Use the provided array filter to set the status to 'completed'
                },
                {
                    arrayFilters: [{ 'task.key': taskId }] // Array filter to match the specific task with the provided taskId
                }
            );

            // Check if the update was successful and at least one document was modified
            if (result.modifiedCount > 0) {
                return true; // Task updated successfully
            } else {
                throw new Error('Task not found for the given user.'); // Task with the provided ID not found
            }
        } catch (error) {
            return error;
        } finally {
            await this.client.close();
        }
    }


    async EditByEmail(collection, email, doc) {
        try {
            await this.client.connect();

            await this.client.db(this.db_name).collection(collection).updateOne(
                { email: email },
                { $push: { Tasks: { ...doc } } });
        } catch (error) {
            console.error('Failed to update document:', error);
            throw error;
        } finally {
            await this.client.close();
        }
    }

    async AddTaskToUser(collection, user, task) {
        try {
            user.Tasks.push(task);
            await this.client.connect();
            await this.client.db(this.db_name).collection(collection).updateOne(
                { email: user.email },
                { $set: { Tasks: user.Tasks } });
        } catch (error) {
            console.error('Failed to update document:', error);
            throw error;
        } finally {
            await this.client.close();
        }
    }

    async CompleteTask(collection, user, taskId) {
        try {

            let tasks = user.Tasks.map((task) => {
                if (new ObjectId(taskId).equals(task._id)) {
                    console.log(task._id);
                    task.status = 'completed'
                }
                return task;
            })

            await this.client.connect();
            await this.client.db(this.db_name).collection(collection).updateOne(
                { email: user.email },
                { $set: { Tasks: tasks } });
        } catch (error) {
            console.error('Failed to update document:', error);
            throw error;
        } finally {
            await this.client.close();
        }
    }



    async Reactive(collection, id) {
        try {
            await this.client.connect();
            return await this.client.db(this.db_name).collection(collection).updateOne(
                { _id: new ObjectId(id) },
                { $set: { is_active: true } }
            );
        } catch (error) {
            return error;
        }
        finally {
            await this.client.close();
        }
    }

}

module.exports = DB;
