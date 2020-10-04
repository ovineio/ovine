import styled from 'styled-components'

export const StyledList = styled.div`
  width: 100%;

  ul {
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;
  }
  li {
    padding: 0 4px;
    list-style: none;
    cursor: pointer;
    &:hover {
      color: blue;
    }
  }

  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 5px 0;
    padding: 5px;
    border: 1px solid #dedede;

    p {
      margin: 0;
    }
  }
  .list-add {
    justify-content: center;
    margin-top: 15px;
    cursor: pointer;

    .fa-plus {
      padding-right: 4px;
    }
  }

  .list-empty {
    margin: 20px 0;
    text-align: center;
  }
`
