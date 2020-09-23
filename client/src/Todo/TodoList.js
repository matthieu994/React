import React, { Component } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { FaTrash, FaCheck, FaPencilAlt, FaPlus } from "react-icons/fa";
import FlipMove from "react-flip-move";
import "./TodoList.css";
import Alert from "react-s-alert";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/slide.css";
import "react-s-alert/dist/s-alert-css-effects/scale.css";
import "react-s-alert/dist/s-alert-css-effects/bouncyflip.css";
import "react-s-alert/dist/s-alert-css-effects/flip.css";
import "react-s-alert/dist/s-alert-css-effects/genie.css";
import "react-s-alert/dist/s-alert-css-effects/jelly.css";
import "react-s-alert/dist/s-alert-css-effects/stackslide.css";

class TodoList extends Component {
  constructor() {
    super();
    this.state = {
      userInput: "",
      items: [],
      edit: null,
    };
  }

  componentDidMount() {
    this.get();
  }

  componentWillUnmount() {
    this.isCancelled = true;
  }

  async get() {
    axios
      .get("/todos")
      .then((res) => {
        !this.isCancelled &&
          this.setState({
            items: res.data,
          });
      })
      .catch((err) => console.log(err));
  }

  onKeyDown(event) {
    if (event.key === "Enter" && !event.ctrlKey) {
      this.create(event);
      return;
    }
    if (event.key === "Enter" && event.ctrlKey) {
      var newInput = this.state.userInput + "\n";
      this.setState({
        userInput: newInput,
      });
    }
  }

  onChange(event) {
    this.setState({
      userInput: event.target.value,
    });
  }

  create(event) {
    event.preventDefault();

    if (this.state.userInput.trim() === "") return;

    if (this.state.edit) {
      axios
        .put("/todos", {
          text: this.state.userInput.trim(),
          id: this.state.edit,
        })
        .then(() => this.get())
        .catch((err) => console.log(err));

      this.setState({
        edit: "",
      });

      Alert.info("Elément modifié !", {
        position: "top-left",
        effect: "flip",
        timeout: 2000,
      });
    } else {
      axios
        .post("/todos", {
          text: this.state.userInput.trim(),
        })
        .then(() => this.get())
        .catch((err) => console.log(err));

      Alert.success("Elément ajouté à la liste !", {
        position: "top-left",
        effect: "flip",
        timeout: 2000,
      });
    }

    this.setState({
      userInput: "",
    });
  }

  edit(index) {
    this.setState({
      userInput: this.state.items[index].text,
      edit: this.state.items[index]._id,
    });
    this.render();
  }

  cancelEdit() {
    this.setState({
      userInput: "",
      edit: "",
    });
  }

  delete(index) {
    axios
      .delete("/todos", {
        data: {
          id: this.state.items[index]._id,
        },
      })
      .then(() => this.get())
      .catch((err) => console.log(err));

    Alert.info("Elément supprimé !", {
      position: "top-left",
      effect: "flip",
      timeout: 2000,
    });
  }

  renderTodos() {
    return this.state.items.map((item, index) => {
      if (!item) return null;
      return (
        <FlipMove key={item._id}>
          <div
            className={
              item.done
                ? "list-group-item"
                : "list-group-item list-group-item-action list-group-item-info"
            }
          >
            <div className="text">
              <span>{item.done ? <del> {item.text} </del> : item.text}</span>
            </div>
            <div className="buttons">
              <Button color="cyan" onClick={this.check.bind(this, index)}>
                <FaCheck />
              </Button>
              <Button color="cyan" onClick={this.edit.bind(this, index)}>
                <FaPencilAlt />
              </Button>
              <Button color="cyan" onClick={this.delete.bind(this, index)}>
                <FaTrash />
              </Button>
            </div>
          </div>
        </FlipMove>
      );
    });
  }

  check(index) {
    axios
      .put("/todos", {
        id: this.state.items[index]._id,
        done: !this.state.items[index].done,
      })
      .then(() => this.get())
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <div className="container">
        <h1 className="mt-4 text-center">Ma To-do List</h1>
        <form>
          <div className="form-group mt-4">
            <input
              className="form-control"
              onKeyDown={this.onKeyDown.bind(this)}
              onChange={this.onChange.bind(this)}
              value={this.state.userInput}
              type="text"
              placeholder="Ajoutez une chose à faire..."
            />
          </div>
          <Button color="primary" onClick={this.create.bind(this)}>
            {this.state.edit ? "Modifier" : "Ajouter"}
            <FaPlus />
          </Button>
          {this.state.edit && (
            <Button color="danger" className="edit" onClick={this.cancelEdit.bind(this)}>
              Annuler
            </Button>
          )}
        </form>
        <div className="list-group mt-3 mb-5">{this.renderTodos()}</div>
        <Alert stack={{ limit: 3 }} />
      </div>
    );
  }
}

export default TodoList;
