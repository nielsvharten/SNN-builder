import { Component, OnInit } from '@angular/core';
import { EditorService } from '../editor.service';
import { Network, NetworkArray } from '../editor';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})

export class EditorComponent implements OnInit {
  triviaData: NetworkArray = [];
  question: Network|null = null;

  constructor(private editorService: EditorService) { }

  ngOnInit(): void {
    this.getTrivia();
  }

  getTrivia() {
    this.editorService.getNetworks().subscribe({
        next: (data) => {
          this.triviaData = data;
          this.getNextQuestion();
        },
        error: (error) => {
          console.log(error);
        }
      }
    )
  }

  getNextQuestion() {
    if (this.triviaData.length) {
      const index = Math.floor(Math.random() * this.triviaData.length);
      this.question = this.triviaData[index];
      this.triviaData.splice(index, 1);
    } else {
      this.question = null;
    }
  }

}
